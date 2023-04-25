import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  ReportsApiService,
} from '@msh/configurations/data-access-configurations';
import { GlobalToastService } from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { BehaviorSubject } from 'rxjs';
import { DynamicReportsComponent } from '../dynamic-reports/dynamic-reports.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'msh-manage-dynamic-reports',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    DynamicReportsComponent,
    ToolbarModule,
    RippleModule,
    FormsModule,
  ],
  templateUrl: './manage-dynamic-reports.component.html',
  styleUrls: ['./manage-dynamic-reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class ManageDynamicReportsComponent implements OnInit {
  private reports$$ = new BehaviorSubject<any[]>([]);
  reports$ = this.reports$$.asObservable();
  filters: LazyLoadEvent = {} as LazyLoadEvent;
  rolesDropdown: any;
  totalRecords = 0;
  selectedReport: any | null = null;
  selectedReports: any[] = [];
  displayModal = false;
  event = {
    first: 0,
    rows: 10,
    sortOrder: 1,
    filters: {},
    globalFilter: null,
  };
  reportName: any;
  constructor(
    private readonly toastService: GlobalToastService,
    private reportsApiService: ReportsApiService,
  ) {}

  onNewClick() {
    this.displayModal = true;
    this.selectedReport = {} as any;
  }

  onModalClose() {
    this.displayModal = false;
    this.selectedReport = null;
  }

  ngOnInit() {
    this.getReports(this.event);
  }
  getReports($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);
    this.reportsApiService
      .loadRoleReports($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.reports$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  getReportsName(reportName: string) {
    if (reportName) {
      this.reportsApiService
        .getReportName(reportName)
        .pipe(untilDestroyed(this))
        .subscribe(response => {
          this.reports$$.next(response.data);
          this.totalRecords = response.data.length;
        });
    } else {
      this.getReports(this.event);
    }
  }

  paginate($event: number) {
    this.event.first = $event;
    this.getReports(this.event);
  }
}
