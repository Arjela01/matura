import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Reports } from '@msh/configurations/domain-configurations';
import { GRID_ACTIONS, GridEvent } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { PaginatorModule } from 'primeng/paginator';
import { ReportsApiService } from '../../../configurations/data-access-configurations/src';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject } from 'rxjs';

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
  private reports$$ = new BehaviorSubject<any[]>([]);
  @Input() reports: any[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  // pagedReports: any[] = [];
  currentPage = 1;

  pageSize = 6;

  //Keep it local state because of Table Header checkbox not syncing
  selectedReports: Reports[] = [];
  filters: LazyLoadEvent = {} as LazyLoadEvent;

  @Output() gridEvent = new EventEmitter<GridEvent<any | any[]>>();
  @Output() changePage = new EventEmitter()
  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  constructor(
    private router: Router,
    private reportsApiService: ReportsApiService
  ) {}

  // ngOnInit() {
  //   const event = {
  //     first: 0,
  //     rows: 10,
  //     sortOrder: 1,
  //     filters: {},
  //     globalFilter: null,
  //   };
  //
  //   this.getReports(event);
  // }
  // getReports(event: any) {
  //   this.reportsApiService
  //     .loadRoleReports(event)
  //     .pipe(untilDestroyed(this))
  //     .subscribe(response => {
  //       this.reports$$.next(response.data);
  //       this.totalRecords = response.total;
  //     });
  // }

  onViewClick(reports: any) {
    this.router.navigate([`reports/${reports.reportId}`]);
  }

  onDeleteClick(reports: any) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: reports,
    } as GridEvent<Reports>);
  }

  onSelectAllClick() {
    if (this.selectedReports.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<Reports>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedReports,
      } as GridEvent<Reports[]>);
    }
  }

  onRowSelect({ data }: { data: any }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: data,
    } as GridEvent<Reports>);
  }

  onRowUnselect({ data }: { data: any }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: data,
    } as GridEvent<Reports>);
  }

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.updatePage(this.currentPage);
  }

  updatePage(pageNumber: number) {
    const startIndex = (pageNumber - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    // this.reports = this.reports.slice(startIndex, endIndex);
    this.changePage.emit((pageNumber - 1) * this.pageSize)
  }
}
