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
    rows: 1,
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

  performSearch() {
    if(!this.searchQuery)
      return;

    if(/^\d/.test(this.searchQuery)) {
      this.event.filters = {"studentId":[{"value":this.searchQuery,"matchMode":"equals","operator":"and"}]};
    } else {
      this.event.filters = {"idCard":[{"value":this.searchQuery,"matchMode":"equals","operator":"and"}]};
    }

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
}
