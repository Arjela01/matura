import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Reports } from '@msh/configurations/domain-configurations';
import { GridEvent } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { PaginatorModule } from 'primeng/paginator';
import { UntilDestroy } from '@ngneat/until-destroy';

@Component({
  selector: 'msh-dynamic-reports',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
    RippleModule,
    PaginatorModule,
  ],
  templateUrl: './dynamic-reports.component.html',
  styleUrls: ['./dynamic-reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class DynamicReportsComponent {
  @Input() reports: Reports[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  currentPage = 1;

  pageSize = 10;

  //Keep it local state because of Table Header checkbox not syncing
  selectedReports: Reports[] = [];

  @Output() gridEvent = new EventEmitter<GridEvent<any | any[]>>();
  @Output() changePage = new EventEmitter();
  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  constructor(private router: Router) {}

  onViewClick(reports: Reports) {
    this.router.navigate([`reports/${reports.reportId}`]).then();
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.updatePage(this.currentPage);
  }

  updatePage(pageNumber: number) {
    const startIndex = (pageNumber - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.changePage.emit((pageNumber - 1) * this.pageSize);
  }
}
