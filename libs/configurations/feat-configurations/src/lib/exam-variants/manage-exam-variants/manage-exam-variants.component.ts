import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  AcademicYear,
  ExamSubjectProfile,
  ExamVariant,
} from '@msh/shared/domain-models';
import {
  GRID_ACTIONS,
  GlobalToastService,
  GridEvent,
} from '@msh/shared/util-shared';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';

import {
  AcademicYearApiService,
  ExamSubjectApiService,
  ExamTypeApiService,
  ExamVariantApiService,
  ProfileApiService,
  ProfileGroupApiService,
} from '@msh/configurations/data-access-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { RippleModule } from 'primeng/ripple';
import { TableLazyLoadEvent } from 'primeng/table';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  skip,
  switchMap,
  tap,
} from 'rxjs';
import { ExamVariantFormComponent } from '../exam-variant-form/exam-variant-form.component';
import { ExamVariantGridComponent } from '../exam-variant-grid/exam-variant-grid.component';
import { AuthFacade } from '@msh/auth/data-access-auth';
import { Router } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'msh-manage-exam-variants',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ExamVariantFormComponent,
    ExamVariantGridComponent,
    ToolbarModule,
    RippleModule,
  ],
  templateUrl: './manage-exam-variants.component.html',
  styleUrls: ['./manage-exam-variants.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageExamVariantsComponent implements OnInit {
  examVariants$$ = new BehaviorSubject<ExamVariant[]>([]);
  examVariants$ = this.examVariants$$.asObservable();
  filters: TableLazyLoadEvent | null = null;
  totalRecords = 0;
  selectedExamVariant: ExamVariant | null = null;
  selectedExamVariants: ExamVariant[] = [];
  displayModal = false;
  profileGroups: DropdownModel<number>[] = [];
  profiles: DropdownModel<number>[] = [];
  examTypes: DropdownModel<number>[] = [];
  examSubjects: DropdownModel<string>[] = [];
  academicYears: any[] = [];
  academicYearForm: Partial<AcademicYear> = {
    id: 0,
    year: '',
  };
  academicYear: Partial<AcademicYear> | null = null;
  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly examVariantService: ExamVariantApiService,
    private readonly profileGroupApiService: ProfileGroupApiService,
    private readonly examTypesApiService: ExamTypeApiService,
    private readonly examSubjectsApiService: ExamSubjectApiService,
    private readonly profileApiService: ProfileApiService,
    private readonly cd: ChangeDetectorRef,
    private readonly examSubjectService: ExamSubjectApiService,
    private academicApiService: AcademicYearApiService,
    protected authFacade: AuthFacade,
    private readonly router: Router
  ) {}

  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    skip(1),
    map(([_]) => {
      if (this.filters) {
        this.getExamVariants(this.filters as TableLazyLoadEvent);
      }
    }),
    tap()
  );

  ngOnInit(): void {
    this.getExamTypesDropdown();
    this.getExamSubjectsDropdown();
    const token = localStorage.getItem('token');
    if (token) {
      this.authFacade.academicYear$
        .pipe(
          switchMap((data: any) => {
            if (!data) {
              try {
                data = JSON.parse(
                  localStorage.getItem('academicYear') as string
                );
              } catch (err) {
                data = null;
              }
            }
            this.academicYear = { ...data };
            return this.getAcademicYears();
          })
        )

        .subscribe(academicYear => {
          this.academicYears = academicYear.data;
        });
    }
  }

  onNewClick() {
    this.displayModal = true;
    this.selectedExamVariant = {} as ExamVariant;
  }
  loadExamSubjects($event: ExamVariant) {
    this.examSubjectService
      .loadDropDownListNotMappedToProfiles(
        $event.examVariantAcademicYearId,
        $event.profileId,
        $event.examTypeId,
        $event.examSubjectId
      )
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examSubjects = response.data;
        this.cd.detectChanges();
      });
  }
  onGridEvent(event: GridEvent<ExamVariant | ExamVariant[]>) {
    switch (event.action) {
      case GRID_ACTIONS.EDIT:
        this.selectedExamVariant = Object.assign({}, event.data as ExamVariant);
        this.displayModal = true;
        break;
      case GRID_ACTIONS.ADD:
        this.router.navigate([
          `/evaluations/exam-question/${(event.data as ExamVariant).id}`,
        ]);
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt që doni të fshini variantin e zgjedhur?',
          accept: () => {
            this.deleteExamVariant(event.data as ExamVariant);
          },
        });
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
  }

  onFormSave(examVariant: ExamVariant) {
    if (examVariant.id) {
      this.updateExamVariant(examVariant);
    }
    if (!examVariant.id) {
      this.addExamVariant(examVariant);
    }
    this.displayModal = false;
  }

  getExamVariants($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.examVariantService
      .loadExamVariants($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examVariants$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  addExamVariant(examVariant: ExamVariant) {
    this.examVariantService
      .save(examVariant)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Varianti u shtua me sukses!');
          this.displayModal = false;
          this.getExamVariants(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë shtimit së variantit!'
          );
      });
  }

  updateExamVariant(examVariant: ExamVariant) {
    this.examVariantService
      .update(examVariant)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Varianti u ndryshua me sukses!');
          this.displayModal = false;
          this.getExamVariants(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së variantit!'
          );
      });
  }

  deleteExamVariant(examVariant: ExamVariant) {
    this.examVariantService
      .delete(examVariant.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Varianti u fshi me sukses!');
          this.getExamVariants(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes së variantit!'
          );
      });
  }
  getExamTypesDropdown() {
    this.examTypesApiService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examTypes = response.data;
      });
  }
  getExamSubjectsDropdown() {
    this.examSubjectsApiService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examSubjects = response.data;
      });
  }
  getAcademicYears(): Observable<any> {
    return this.academicApiService.getAcademicYearsFiltered();
  }
}
