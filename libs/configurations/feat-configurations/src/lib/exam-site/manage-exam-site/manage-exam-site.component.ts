import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';

import {
  AdministrationOfficeApiService,
  ExamSiteApiService,
  HighSchoolApiService,
} from '@msh/configurations/data-access-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ExamSite } from '@msh/shared/domain-models';

import {
  GRID_ACTIONS,
  GlobalToastService,
  GridEvent,
} from '@msh/shared/util-shared';

import { AuthFacade } from '@msh/auth/data-access-auth';
import { RippleModule } from 'primeng/ripple';
import { BehaviorSubject, combineLatest, map, tap } from 'rxjs';
import { ExamSiteFormComponent } from '../exam-site-form/exam-site-form.component';
import { ExamSiteGridComponent } from '../exam-site-grid/exam-site-grid.component';

@UntilDestroy()
@Component({
  selector: 'msh-manage-exam-site',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ExamSiteFormComponent,
    ExamSiteGridComponent,
    ToolbarModule,
    RippleModule,
  ],
  templateUrl: './manage-exam-site.component.html',
  styleUrls: ['./manage-exam-site.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageExamSiteComponent implements OnInit {
  private examSites$$ = new BehaviorSubject<ExamSite[]>([]);
  examSites$ = this.examSites$$.asObservable();
  filters: LazyLoadEvent | null = null;

  totalRecords = 0;
  selectedExamSite: ExamSite | null = null;
  selectedExamSites: ExamSite[] = [];
  displayModal = false;
  administrationOffices: DropdownModel<number>[] = [];
  highSchools: DropdownModel<string>[] = [];
  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    map(([_]) => {
      if (this.filters) {
        this.getExamSites(this.filters);
      }
    }),
    tap()
  );
  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly examSiteService: ExamSiteApiService,
    private readonly cd: ChangeDetectorRef,
    private readonly highSchoolService: HighSchoolApiService,
    private readonly administrationOfficeApiService: AdministrationOfficeApiService,
    private authFacade: AuthFacade
  ) {}

  ngOnInit(): void {
    this.getAdministrationOfficeDropdown();
  }

  onNewClick() {
    this.displayModal = true;
    this.selectedExamSite = {} as ExamSite;
  }

  onGridEvent(event: GridEvent<ExamSite | ExamSite[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedExamSites = [
          ...this.selectedExamSites,
          event.data as ExamSite,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedExamSites = this.selectedExamSites.filter(es => {
          return es.id !== (event.data as ExamSite).id;
        });
        break;

      case GRID_ACTIONS.SELECT_MANY:
        this.selectedExamSites = [
          ...this.selectedExamSites,
          ...(event.data as ExamSite[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedExamSites = [];
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedExamSite = Object.assign({}, event.data as ExamSite);
        this.getHighSchools(this.selectedExamSite.administrationOfficeId);
        this.getAdministrationOfficeDropdown();
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message:
            'Jeni i sigurt që doni të fshini qendrën e provimit të zgjedhur?',
          accept: () => {
            this.deleteExamSite(event.data as ExamSite);
          },
        });
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
  }

  onFormSave(examSite: ExamSite) {
    console.log(examSite);
    if (examSite.id) {
      this.updateExamSite(examSite);
    }
    if (!examSite.id) {
      this.addExamSite(examSite);
    }
  }
  onAdministrationOfficeChanged(administrationOfficeId: any) {
    if (this.selectedExamSite != null)
      this.selectedExamSite.administrationOfficeId = administrationOfficeId;
    this.getHighSchools(administrationOfficeId);
  }
  onHighSchoolChanged(highSchoolIds: any) {
    if (this.selectedExamSite !== null) {
      this.selectedExamSite.highschoolIds = highSchoolIds;
    }
  }

  getExamSites($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.examSiteService
      .loadExamSites($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examSites$$.next(response.data);
        this.totalRecords = response.total;
        this.cd.detectChanges();
      });
  }

  getHighSchools(administrationOfficeId?: any) {
    this.highSchoolService
      .forAdministrationOffice(administrationOfficeId)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.highSchools = response.data;
        this.cd.detectChanges();
      });
  }

  addExamSite(examSite: ExamSite) {
    this.examSiteService
      .save(examSite)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Qendra e provimit u shtua me sukses!');
          this.displayModal = false;
          this.getExamSites(this.filters as LazyLoadEvent);
        } else {
          this.toastService.showError(response.errorMessage);
        }

        if (response.isBadRequest) {
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të qendrës së provimit!'
          );
        }
      });
  }

  updateExamSite(examSite: ExamSite) {
    this.examSiteService
      .update(examSite)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            'Qendra e provimit u ndryshua me sukses!'
          );
          this.displayModal = false;
          this.getExamSites(this.filters as LazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së qendrës së provimit!'
          );
      });
  }

  deleteExamSite(examSite: ExamSite) {
    this.examSiteService
      .delete(examSite.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Qendra e provimit u fshi me sukses!');
          this.getExamSites(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes të qendrës së provimit!'
          );
      });
  }

  getAdministrationOfficeDropdown() {
    this.administrationOfficeApiService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.administrationOffices = response.data;
        this.cd.markForCheck();
      });
  }
}
