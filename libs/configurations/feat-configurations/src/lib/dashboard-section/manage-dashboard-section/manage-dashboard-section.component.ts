import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';

import {
  DashboardSectionApiService,
  StudentBanApiService,
} from '@msh/configurations/data-access-configurations';
import {AcademicYear, DashboardSection, StudentBan} from '@msh/shared/domain-models';

import {
  GlobalToastService,
  GridEvent,
  GRID_ACTIONS,
} from '@msh/shared/util-shared';

import { BehaviorSubject } from 'rxjs';
import { RippleModule } from 'primeng/ripple';
import { DashboardSectionFormComponent } from '../dashboard-section-form/dashboard-section-form.component';
import { DashboardSectionGridComponent } from '../dashboard-section-grid/dashboard-section-grid.component';

@UntilDestroy()
@Component({
  selector: 'msh-manage-dashboard-section',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ToolbarModule,
    RippleModule,
    DashboardSectionFormComponent,
    DashboardSectionGridComponent,
  ],
  templateUrl: './manage-dashboard-section.component.html',
  styleUrls: ['./manage-dashboard-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageDashboardSectionComponent {
  private dashboardSections$$ = new BehaviorSubject<DashboardSection[]>([]);
  dashboardSections$ = this.dashboardSections$$.asObservable();
  filters: LazyLoadEvent | null = null;

  totalRecords = 0;
  selectedDashboardSection: DashboardSection | null = null;
  selectedDashboardSections: DashboardSection[] = [];
  displayModal = false;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly dashboardSectionService: DashboardSectionApiService
  ) {}

  onNewClick() {
    this.displayModal = true;
  }
  onModalClose() {
    this.displayModal = false;
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Jeni i sigurt që doni të fshini studentët e zgjedhur?',
      accept: () => {
        this.toastService.showWarning('Studentët e zgjedhur u fshinë!');
      },
    });
  }

  onGridEvent(event: GridEvent<DashboardSection | DashboardSection[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedDashboardSections = [
          ...this.selectedDashboardSections,
          event.data as DashboardSection,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedDashboardSections = this.selectedDashboardSections.filter(
          sb => {
            sb.id !== (event.data as DashboardSection).id;
          }
        );
        break;

      case GRID_ACTIONS.SELECT_MANY:
        this.selectedDashboardSections = [
          ...this.selectedDashboardSections,
          ...(event.data as DashboardSection[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedDashboardSections = [];
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedDashboardSection = Object.assign(
          {},
          event.data as DashboardSection
        );
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message:
            'Jeni i sigurt që doni të fshini studentin e skualifikuar të zgjedhur?',
          accept: () => {
            this.deleteDashboardSection(event.data as DashboardSection);
          },
        });
        break;
    }
  }
  onFormSave(dashboardSection: DashboardSection) {
    if (dashboardSection.id) {
      this.updateDashboardSection(dashboardSection);
    }
    if (!dashboardSection.id) {
      this.addDashboardSection(dashboardSection);
    }
  }

  getDashboardSections($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.dashboardSectionService
      .loadDashboardSections($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.dashboardSections$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  addDashboardSection(dashboardSection: DashboardSection) {
    this.dashboardSectionService
      .save(dashboardSection)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Studenti u shtua me sukses!');
          this.displayModal = false;
          this.getDashboardSections(this.filters as LazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të studentit!'
          );
      });
  }

  updateDashboardSection(dashboardSection: DashboardSection) {
    this.dashboardSectionService
      .update(dashboardSection)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Studenti u ndryshua me sukses!');
          this.getDashboardSections(this.filters as LazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);
        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të studentit!'
          );
        this.displayModal = false;
      });
  }

  deleteDashboardSection(dashboardSection: DashboardSection) {
    this.dashboardSectionService
      .delete(dashboardSection.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Studenti u fshi me sukses!');
          this.getDashboardSections(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes të studentit!'
          );
      });
  }
}
