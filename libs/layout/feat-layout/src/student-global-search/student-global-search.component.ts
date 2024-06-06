import { Component, HostListener, Input, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { catchError, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'primeng/api';
import { Router } from '@angular/router';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { StudentsAuditService } from '@msh/audit-logs/data-access-audit-log';
import { Student } from '@msh/shared/domain-models';

@UntilDestroy()
@Component({
  standalone: true,
  selector: 'msh-student-global-search',
  templateUrl: './student-global-search.component.html',
  styleUrls: ['./student-global-search.component.scss'],
  imports: [CommonModule, FormsModule, SharedModule, AutoCompleteModule],
})
export class StudentGlobalSearchComponent {
  searchBoxVisible = false;
  searchQuery: any;
  searchResults: any[] = [];
  itemsToSearch: Student[] = [];
  studentGuid = '';

  event: any = {
    first: 0,
    rows: 1000,
    sortOrder: 1,
    filters: {},
    globalFilter: null,
  };

  constructor(
    private studentService: StudentsAuditService,
    private router: Router
  ) {
    this.itemsToSearch = [];
  }

  fetchStudents() {
    this.studentService
      .loadStudents(this.event)
      .pipe(
        untilDestroyed(this),
        catchError(error => {
          return throwError(error);
        })
      )
      .subscribe(response => {
        this.itemsToSearch = response.data ?? [];
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

    if (event.ctrlKey && event.shiftKey && event.key === 'L' && !isLoginPage) {
      if (!this.searchBoxVisible) {
        this.searchBoxVisible = true;
        this.fetchStudents();

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

  onItemClick() {
    this.router.navigate([`/applications/students/view/${this.studentGuid}`]);
    this.searchBoxVisible = false;
    this.searchQuery = '';
  }

  performSearch() {
    if (this.itemsToSearch !== undefined) {
      let result;
      if (/^\d/.test(this.searchQuery)) {
        result = this.itemsToSearch.filter(
          s => s.studentId === this.searchQuery
        );
      } else {
        result = this.itemsToSearch.filter(s => s.idCard === this.searchQuery);
      }
      if (result.length > 0) {
        this.studentGuid = result[0].id;
      }
      result = result.map(
        s =>
          `${s.studentId} , ${s.idCard} , ${s.firstName} ${s.middleName} ${s.lastName}`
      );
      this.searchResults = result;
    }
    if (this.searchQuery === '') {
      this.searchResults = [];
    }
  }
}
