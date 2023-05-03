import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ReportsApiService,
  RolesApiService,
} from '@msh/configurations/data-access-configurations';
import { Reports } from '@msh/configurations/domain-configurations';

import {
  GlobalToastService,
  GridEvent,
  GRID_ACTIONS,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { BehaviorSubject } from 'rxjs';
import { ReportsFormComponent } from '../reports-form/reports-form.component';
import { ReportsGridComponent } from '../reports-grid/reports-grid.component';

@Component({
  selector: 'msh-manage-reports',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ReportsFormComponent,
    ReportsGridComponent,
    ToolbarModule,
    RippleModule,
  ],
  templateUrl: './manage-reports.component.html',
  styleUrls: ['./manage-reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
@UntilDestroy()
export class ManageReportsComponent {
  private reports$$ = new BehaviorSubject<Reports[]>([]);
  reports$ = this.reports$$.asObservable();
  filters: LazyLoadEvent = {} as LazyLoadEvent;
  rolesDropdown: any;
  totalRecords = 0;
  selectedReport: Reports | null = null;
  selectedReports: Reports[] = [];
  displayModal = false;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private reportsApiService: ReportsApiService,
    private rolesService: RolesApiService
  ) {
    this.getRolesDropdown();
  }

  onNewClick() {
    this.displayModal = true;
    this.selectedReport = {} as Reports;
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete selected reports?',
      accept: () => {
        this.toastService.showWarning('Reports deleted!');
      },
    });
  }

  onGridEvent(event: GridEvent<Reports | Reports[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedReports = [...this.selectedReports, event.data as Reports];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedReports = this.selectedReports.filter(rep => {
          rep.id !== (event.data as Reports).id;
        });
        break;
      case GRID_ACTIONS.SELECT_MANY:
        this.selectedReports = [
          ...this.selectedReports,
          ...(event.data as Reports[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedReports = [];
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedReport = Object.assign({}, event.data as Reports);
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Jeni te sigurt per fshirjen e raportit?',
          accept: () => {
            this.deleteReports(event.data as Reports);
          },
        });
        break;
    }
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
        }  else this.toastService.showError(response.errorMessage)

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
        }  else this.toastService.showError(response.errorMessage)

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
        }  else this.toastService.showError(response.errorMessage)

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi nje problem gjatë fshirjes së raportit!'
          );
      });
  }
}
