import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ReportsApiService,
  RolesApiService,
} from '@msh/configurations/data-access-configurations';
import { Reports } from '@msh/configurations/domain-configurations';

import { Router } from '@angular/router';
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
  private reports$$ = new BehaviorSubject<Reports[]>([]);
  reports$ = this.reports$$.asObservable();
  filters: LazyLoadEvent = {} as LazyLoadEvent;
  rolesDropdown: any;
  totalRecords = 0;
  selectedReport: Reports | null = null;
  selectedReports: Reports[] = [];
  displayModal = false;

  constructor(
    private readonly toastService: GlobalToastService,
    private reportsApiService: ReportsApiService,
    private rolesService: RolesApiService,
    private router: Router
  ) {
    this.getRolesDropdown();
  }

  onNewClick() {
    this.displayModal = true;
    this.selectedReport = {} as Reports;
  }

  onModalClose() {
    this.displayModal = false;
    this.selectedReport = null;
  }

  onFormSave(report: Reports) {
    if (report.id) {
      this.updateReports(report);
    }
    if (!report.id) {
      this.addReports(report);
    }
  }

  getReports($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);
    this.reportsApiService
      .loadReports($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.reports$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  getRolesDropdown() {
    this.rolesService.loadDropdownList().subscribe(response => {
      this.rolesDropdown = response.data;
    });
  }
  addReports(reports: Reports) {
    this.reportsApiService
      .save(reports)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Raporti u shtua me sukses!');
          this.displayModal = false;
          this.getReports(this.filters);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi nje problem gjatë ndryshimit të raportit !'
          );
      });
  }

  updateReports(report: Reports) {
    this.reportsApiService
      .update(report)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Raporti u ndryshua me sukses!');
          this.displayModal = false;
          this.getReports(this.filters);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi nje problem gjatë ndryshimit të raportit!'
          );
      });
  }

  deleteReports(report: Reports) {
    this.reportsApiService
      .delete(report.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Raporti u fshi me sukses!');
          this.getReports(this.filters);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi nje problem gjatë fshirjes së raportit!'
          );
      });
  }
}
