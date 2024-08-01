import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmationService } from 'primeng/api';
import { BehaviorSubject, combineLatest, map, skip, tap } from 'rxjs';
import { ExamSubjectProfile } from '@msh/shared/domain-models';
import {
  GlobalToastService,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import {
  AcademicYearApiService,
  ExamSubjectApiService,
  ExamSubjectProfileApiService,
  ExamTypeApiService,
  ProfileApiService,
} from '@msh/configurations/data-access-configurations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { RippleModule } from 'primeng/ripple';
import { ExamSubjectProfileFormComponent } from '../exam-subject-profile-form/exam-subject-profile-form.component';
import { ExamSubjectProfileGridComponent } from '../exam-subject-profile-grid/exam-subject-profile-grid.component';
import * as FileSaver from 'file-saver';
import { TableLazyLoadEvent } from 'primeng/table';
import { AuthFacade } from '@msh/auth/data-access-auth';

@UntilDestroy()
@Component({
  selector: 'msh-manage-exam-subject-profile',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    ConfirmDialogModule,
    ExamSubjectProfileFormComponent,
    ToolbarModule,
    RippleModule,
    ExamSubjectProfileGridComponent,
  ],
  templateUrl: './manage-exam-subject-profile.component.html',
  styleUrls: ['./manage-exam-subject-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageExamSubjectProfileComponent implements OnInit {
  private examSubjectProfiles$$ = new BehaviorSubject<ExamSubjectProfile[]>([]);
  examSubjectProfiles$ = this.examSubjectProfiles$$.asObservable();
  filters: TableLazyLoadEvent | null = null;

  totalRecords = 0;
  selectedExamSubjects: ExamSubjectProfile[] = [];
  selectedExamSubject: ExamSubjectProfile | null = null;
  displayModal = false;

  examTypes: DropdownModel<number>[] = [];
  profiles: DropdownModel<number>[] = [];
  academicYears: DropdownModel<number>[] = [];
  examSubjects: DropdownModel<string>[] = [];

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly examSubjectProfileService: ExamSubjectProfileApiService,
    private readonly examSubjectService: ExamSubjectApiService,
    private readonly academicYearsApiService: AcademicYearApiService,
    private readonly examTypesApiService: ExamTypeApiService,
    private readonly profilesApiService: ProfileApiService,
    private readonly cd: ChangeDetectorRef,
    private readonly authFacade: AuthFacade
  ) {}

  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    skip(1),
    map(([_]) => {
      if (this.filters) {
        this.getExamSubjectProfiles(this.filters as TableLazyLoadEvent);
      }
    }),
    tap()
  );

  ngOnInit(): void {
    this.getAcademicYearsDropdown();
    this.getExamTypesDropdown();
    this.getProfilesDropdown();
  }

  onNewClick() {
    this.displayModal = true;
    this.selectedExamSubject = {} as ExamSubjectProfile;
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Jeni i sigurt që doni të fshini lëndët provimeve të zgjedhura?',
      accept: () => {
        //this.highSchoolStore.deleteSelectedHighSchools();
        this.toastService.showWarning('');
      },
    });
  }

  onGridEvent(event: GridEvent<ExamSubjectProfile | ExamSubjectProfile[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedExamSubjects = [
          ...this.selectedExamSubjects,
          event.data as ExamSubjectProfile,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedExamSubjects = this.selectedExamSubjects.filter(es => {
          es.id !== (event.data as ExamSubjectProfile).id;
        });
        break;
      case GRID_ACTIONS.SELECT_MANY:
        this.selectedExamSubjects = [
          ...this.selectedExamSubjects,
          ...(event.data as ExamSubjectProfile[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedExamSubjects = [];
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedExamSubject = Object.assign(
          {},
          event.data as ExamSubjectProfile
        );
        this.loadExamSubjects(this.selectedExamSubject);
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message:
            'Jeni i sigurt që doni të fshini lëndën e provimit të zgjedhur?',
          accept: () => {
            this.deleteExamSubject(event.data as ExamSubjectProfile);
          },
        });
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
  }

  onFormSave(examSubjectProfile: ExamSubjectProfile) {
    if (examSubjectProfile.id) {
      this.update(examSubjectProfile);
    }
    if (!examSubjectProfile.id) {
      this.save(examSubjectProfile);
    }
  }

  getExamSubjectProfiles($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.examSubjectProfileService
      .loadTableData($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examSubjectProfiles$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  save(examSubjectProfile: ExamSubjectProfile) {
    this.examSubjectProfileService
      .save(examSubjectProfile)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Lënda e provimit u shtua me sukses!');
          this.displayModal = false;
          this.getExamSubjectProfiles(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së lëndës së provimit të zgjedhur!'
          );
      });
  }

  update(examSubjectProfile: ExamSubjectProfile) {
    this.examSubjectProfileService
      .update(examSubjectProfile)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            'Lënda e provimit u ndryshua me sukses!'
          );
          this.displayModal = false;
          this.getExamSubjectProfiles(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së lëndës së provimit të zgjedhur!'
          );
      });
  }

  deleteExamSubject(examSubjectProfile: ExamSubjectProfile) {
    this.examSubjectProfileService
      .delete(examSubjectProfile.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Lënda e provimit u fshi me sukses!');
          this.getExamSubjectProfiles(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes së lëndës së provimit!'
          );
      });
  }

  getExamTypesDropdown() {
    this.examTypesApiService.loadDropdownList().subscribe(response => {
      this.examTypes = response.data;
    });
  }

  getProfilesDropdown() {
    this.profilesApiService.loadDropdownList().subscribe(response => {
      this.profiles = response.data;
    });
  }

  getExamSubjects(
    examTypeId?: number,
    academicYearId?: number,
    examSubjectId?: string
  ) {
    this.examSubjectService
      .forExamType(examTypeId, academicYearId, examSubjectId, undefined, true)
      .subscribe(response => {
        this.examSubjects = response.data;
        this.cd.markForCheck();
      });
  }

  getAcademicYearsDropdown() {
    this.academicYearsApiService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.academicYears = response.data;
      });
  }

  loadExamSubjects($event: ExamSubjectProfile) {
    this.examSubjectService
      .loadDropDownListNotMappedToProfiles(
        $event.academicYearId,
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
}
