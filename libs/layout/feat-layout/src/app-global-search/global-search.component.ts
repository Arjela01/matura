import { Component, HostListener } from '@angular/core';
import { MenuApiService } from '@msh/configurations/data-access-configurations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { catchError, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'primeng/api';
import { Router } from '@angular/router';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MenuNode } from '@msh/layout/domain-layout';

@UntilDestroy()
@Component({
  standalone: true,
  selector: 'msh-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss'],
  imports: [CommonModule, FormsModule, SharedModule, AutoCompleteModule],
})
export class GlobalSearchComponent {
  searchBoxVisible = false;
  searchQuery: any;
  searchResults: string[] = [];
  itemsToSearch: MenuNode[] = [];

  event: any = {
    first: 0,
    rows: 1000,
    sortOrder: 1,
    filters: {},
    globalFilter: null,
  };

  constructor(
    private menuService: MenuApiService,
    private router: Router
  ) {
    this.itemsToSearch = [];
  }

  fetchMenuItems() {
    this.menuService
      .loadMenus(this.event)
      .pipe(
        untilDestroyed(this),
        catchError(error => {
          return throwError(error);
        })
      )
      .subscribe(response => {
        this.itemsToSearch = response.data ?? [];
        this.itemsToSearch = this.itemsToSearch.filter(node => node.isVisible);
        for (const item of this.itemsToSearch) {
          item.children =
            this.itemsToSearch.filter(x => x.parentId === item.id) ?? [];
        }
        this.performSearch();
      });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    const isLoginPage =
      window.location.pathname === '/identity' ||
      window.location.pathname === '/user-login';

    if (event.key === 'Escape') {
      if (this.searchBoxVisible) {
        this.searchBoxVisible = false;
      }
    }

    if (event.ctrlKey && event.shiftKey && event.key === 'F' && !isLoginPage) {
      if (!this.searchBoxVisible) {
        this.fetchMenuItems();
        this.searchBoxVisible = true;

        setTimeout(() => {
          const searchInput = document.querySelector(
            '.search-input-container input'
          ) as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
          }
        }, 0);
      } else {
        this.searchBoxVisible = false;
        this.searchQuery = '';
        this.searchResults = [];
      }
    }
  }

  onItemClick($event: any) {
    const selectedItem: any = this.itemsToSearch.find(
      (item: any) => item.id === $event.value.id
    );

    if (selectedItem.url.startsWith('http')) {
      const parser = document.createElement('a');
      parser.href = selectedItem.url;
      selectedItem.url = parser.pathname;
    }

    if (selectedItem.url && selectedItem.url.startsWith('/'))
      selectedItem.url = selectedItem.url.slice(1);

    if (selectedItem && selectedItem.url) {
      this.router.navigate([selectedItem.url]);
      this.searchBoxVisible = false;
      this.searchResults = [];
      this.searchQuery = '';
    }
    this.searchBoxVisible = false;
    this.searchQuery = '';
  }

  makeWordSearchable(word: string) {
    return word.toLowerCase().replace(/ç/g, 'c').replace(/ë/g, 'e');
  }

  getWords(sentence: string) {
    return sentence
      .split(' ')
      .filter(w => w != null && w.length > 0)
      .map(w => this.makeWordSearchable(w));
  }

  wordSearch(searchWords: string[], targetWords: string[]): boolean {
    searchWords = [...new Set(searchWords)].sort((a, b) => b.length - a.length);
    targetWords = [...new Set(targetWords)];

    for (const searchWord of searchWords) {
      const matchedWords = targetWords.filter(w => w.startsWith(searchWord));
      if (matchedWords.length === 0) return false;

      for (const matchedWord of matchedWords) {
        targetWords = targetWords.filter(w => w !== matchedWord);
      }
    }

    return true;
  }

  performSearch() {
    if (
      this.itemsToSearch !== undefined &&
      typeof this.searchQuery === 'string'
    ) {
      const searchWords = this.getWords(this.searchQuery);

      const result = this.itemsToSearch
        .filter(
          node =>
            typeof node === 'object' &&
            node.text &&
            (!node.children || node.children.length == 0)
        )
        .map(node => {
          return { node: node, words: this.getWords(node.text) };
        })
        .filter((item: any) => {
          return this.wordSearch(searchWords, item.words);
        })
        .map((item: any) => item.node);
      this.searchResults = result.sort((a, b) => b.text - a.text);
    }
    if (this.searchQuery === '') {
      this.searchResults = [];
    }
  }
}
