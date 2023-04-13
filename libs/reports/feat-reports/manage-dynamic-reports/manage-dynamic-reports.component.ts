import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ReportsApiService,
  RolesApiService,
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
  ],
  templateUrl: './manage-dynamic-reports.component.html',
  styleUrls: ['./manage-dynamic-reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class ManageDynamicReportsComponent {
  private reports$$ = new BehaviorSubject<any[]>([]);
  reports$ = this.reports$$.asObservable();
  filters: LazyLoadEvent = {} as LazyLoadEvent;
  rolesDropdown: any;
  totalRecords = 0;
  selectedReport: any | null = null;
  selectedReports: any[] = [];
  displayModal = false;

  constructor(
    private readonly toastService: GlobalToastService,
    private reportsApiService: ReportsApiService,
    private rolesService: RolesApiService
  ) {}

  onNewClick() {
    this.displayModal = true;
    this.selectedReport = {} as any;
  }

  onModalClose() {
    this.displayModal = false;
    this.selectedReport = null;
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
}
