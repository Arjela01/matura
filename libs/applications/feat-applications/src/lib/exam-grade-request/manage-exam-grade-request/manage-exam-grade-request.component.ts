import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, combineLatest, map, skip, tap } from 'rxjs';
import {
  ExamGradeRequestModel,
  ExamGradesRequestStatus,
} from '@msh/shared/domain-models';
import { TableLazyLoadEvent } from 'primeng/table';
import { ConfirmationService, SharedModule } from 'primeng/api';
import {
  GlobalToastService,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ExamGradeRequestService } from '@msh/applications/data-access-applications';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ExamGradeRequestGridComponent } from '../exam-grade-request-grid/exam-grade-request-grid.component';
import { ExamGradeRequestFormComponent } from '../exam-grade-request-form/exam-grade-request-form.component';
import {
  AcademicYearApiService,
  HighSchoolApiService,
} from '@msh/configurations/data-access-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ManualExamGradeFormComponent } from '../../manual-exam-grade/manual-exam-grade-form/manual-exam-grade-form.component';
import { StudentsGridComponent } from '../../students/students-grid/students-grid.component';
import { AuthFacade } from '@msh/auth/data-access-auth';

@UntilDestroy()
@Component({
  selector: 'msh-manage-exam-grade-request',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
    RippleModule,
    SharedModule,
    ExamGradeRequestGridComponent,
    ExamGradeRequestFormComponent,
    ManualExamGradeFormComponent,
    StudentsGridComponent,
  ],
  templateUrl: './manage-exam-grade-request.component.html',
  styleUrls: ['./manage-exam-grade-request.component.scss'],
  providers: [ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageExamGradeRequestComponent implements OnInit {
  private examGradeRequest$$ = new BehaviorSubject<ExamGradeRequestModel[]>([]);
  examGradeRequest$ = this.examGradeRequest$$.asObservable();
  filters: TableLazyLoadEvent | null = null;
  totalRecords = 0;

  selectedExamGrade: ExamGradeRequestModel | null = null;
  selectedExamGrades: ExamGradeRequestModel[] = [];
  displayModal = false;
  academicYears: DropdownModel<number>[] = [];
  highSchools: DropdownModel<number>[] = [];

  studentId: string | undefined;
  selectedRecord: any;
  headerText: any;
  displayHistoryForm = false;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly examGradeRequestService: ExamGradeRequestService,
    private readonly academicYearService: AcademicYearApiService,
    private readonly highSchoolService: HighSchoolApiService,
    private readonly authFacade: AuthFacade,
    private cd: ChangeDetectorRef
  ) {}
  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    skip(1),
    map(([_]) => {
      if (this.filters) {
        this.getExamGradeRequest(this.filters as TableLazyLoadEvent);
      }
    }),
    tap()
  );

  onNewClick() {
    this.displayModal = true;
    this.selectedExamGrade = {} as ExamGradeRequestModel;
  }

  onModalClose() {
    this.displayModal = false;
  }

  ngOnInit() {
    this.getAcademicYears();
    this.getHighSchools();
  }

  onGridEvent(event: GridEvent<any | any[]>) {
    switch (event.action) {
      case GRID_ACTIONS.HISTORY:
        this.selectedRecord = Object.assign({}, event.data);
        this.studentId = event.data.id;
        this.headerText = `Historiku për Kërkesën {${event.data.id}}`;
        this.displayHistoryForm = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt që doni të fshini kërkesën e zgjedhur?',
          accept: () => {
            this.deleteExamGradeRequest(event.data as ExamGradeRequestModel);
          },
        });
        break;
    }
  }

  onFormSave(examGradeRequest: ExamGradeRequestModel) {
    this.addExamGradeRequest(examGradeRequest);
  }

  getExamGradeRequest($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.examGradeRequestService
      .loadExamGradeRequest($event)
      .subscribe(response => {
        this.examGradeRequest$$.next(response.data);
        this.totalRecords = response.total;
        this.cd.markForCheck();
      });
  }

  addExamGradeRequest(examGradeRequest: ExamGradeRequestModel) {
    this.examGradeRequestService
      .saveExamGradeRequest(examGradeRequest)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Kërkesa për notat u shtua me sukses!');
          this.displayModal = false;
          this.getExamGradeRequest(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të kërkesës!'
          );
        this.cd.markForCheck();
      });
  }

  deleteExamGradeRequest(examGradeRequest: ExamGradeRequestModel) {
    this.examGradeRequestService
      .deleteExamGradeRequest(examGradeRequest.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Kërkesa për notat u fshi me sukses!');
          this.getExamGradeRequest(this.filters as TableLazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes të kërkesës!'
          );
      });
  }

  getAcademicYears() {
    this.academicYearService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.academicYears = res.data;
      });
  }

  getHighSchools() {
    this.highSchoolService
      .loadDropDownList()
      .pipe(untilDestroyed(this))
      .subscribe(res => (this.highSchools = res.data));
  }
}
