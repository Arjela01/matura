import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { DashboardSectionApiService } from '@msh/configurations/data-access-configurations';
import { DashboardSection } from '@msh/shared/domain-models';
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
import { ToolbarModule } from 'primeng/toolbar';
import { BehaviorSubject } from 'rxjs';
import { RippleModule } from 'primeng/ripple';
import { DashboardSectionsGridComponent } from '../dashboard-sections-grid/dashboard-sections-grid.component';
import { DashboardSectionsFormComponent } from '../dashboard-sections-form/dashboard-sections-form.component';

@Component({
  selector: 'msh-manage-dashboard-sections',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    DashboardSectionsGridComponent,
    DashboardSectionsFormComponent,
    ToolbarModule,
    RippleModule,
  ],
  templateUrl: './manage-dashboard-sections.component.html',
  styleUrls: ['./manage-dashboard-sections.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
@UntilDestroy()
export class ManageDashboardSectionsComponent implements OnInit {
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
    private readonly dashboardSectionService: DashboardSectionApiService,
    private readonly cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    return;
  }

  onNewClick() {
    this.displayModal = true;
    this.selectedDashboardSection = {} as DashboardSection;
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
          pf => {
            pf.id !== (event.data as DashboardSection).id;
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
        // eslint-disable-next-line max-len
        this.selectedDashboardSection = Object.assign(
          {},
          event.data as DashboardSection
        );
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt që doni të fshini seksionin e zgjedhur?',
          accept: () => {
            this.deleteDashboardSection(event.data as DashboardSection);
          },
        });
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
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
      .loadDashboardSection($event)
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
          this.toastService.showSuccess(
            'Seksioni i dashboard-it u shtua me sukses!'
          );
          this.displayModal = false;
          this.getDashboardSections(this.filters as LazyLoadEvent);
          this.cd.detectChanges();
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së dashboard-it!'
          );
      });
  }

  updateDashboardSection(dashboardSection: DashboardSection) {
    this.dashboardSectionService
      .update(dashboardSection)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            'Seksioni i dashboard-it u ndryshua me sukses!'
          );
          this.displayModal = false;
          this.getDashboardSections(this.filters as LazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së dashboard-it!'
          );
      });
  }

  deleteDashboardSection(dashboardSection: DashboardSection) {
    this.dashboardSectionService
      .delete(dashboardSection.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo(
            'Seksioni i dashboard-it u fshi me sukses!'
          );
          this.getDashboardSections(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes të grupit dashboard-it!'
          );
      });
  }
}
