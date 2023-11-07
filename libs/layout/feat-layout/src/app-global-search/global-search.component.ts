import { Component, HostListener, Input, OnInit } from '@angular/core';
import { MenuApiService } from '@msh/configurations/data-access-configurations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { catchError, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'primeng/api';
import { Router } from '@angular/router';

@UntilDestroy()
@Component({
  standalone: true,
  selector: 'msh-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss'],
  imports: [CommonModule, FormsModule, SharedModule],
})
export class GlobalSearchComponent {
  @Input() searchBoxVisible = false;
  searchQuery: any;
  searchResults: string[] = [];
  itemsToSearch: string[] = [];

  event: any = {
    first: 0,
    rows: 100,
    sortOrder: 1,
    filters: {},
    globalFilter: null,
  };

  constructor(private menuService: MenuApiService, private router: Router) {
    this.itemsToSearch = [];
  }

  shiftPressedCount = 0;
  lastShiftPressTime = 0;

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
        this.itemsToSearch = response.data;
        this.performSearch();
      });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    const isLoginPage = window.location.pathname === '/identity';

    if (event.ctrlKey && event.shiftKey && event.key === 'F' && !isLoginPage) {
      if (!this.searchBoxVisible) {
        this.searchBoxVisible = true;
        this.fetchMenuItems();

        setTimeout(() => {
          const searchInput = document.getElementById(
            'searchInput'
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

  onItemClick(itemText: string) {
    const selectedItem: any = this.itemsToSearch.find(
      (item: any) => item.text.toLowerCase() === itemText.toLowerCase()
    );

    if (selectedItem && selectedItem.url) {
      this.router.navigateByUrl(selectedItem.url);
      this.searchBoxVisible = false;
      this.searchResults = [];
      this.searchQuery = '';
    }
    this.searchBoxVisible = false;
  }

  performSearch() {
    if (
      this.itemsToSearch !== undefined &&
      typeof this.searchQuery === 'string'
    ) {
      this.searchResults = this.itemsToSearch
        .filter((item: any) => {
          if (typeof item === 'object' && item.text) {
            return item.text
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase());
          }
          return false;
        })
        .map((item: any) => item.text);
    }
    if (this.searchQuery === '') {
      this.searchResults = [];
    }
  }
}
