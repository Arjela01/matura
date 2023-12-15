import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { ExamGradeRequestModel } from '@msh/shared/domain-models';
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
import { AcademicYearApiService } from '@msh/configurations/data-access-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';

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

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly examGradeRequestService: ExamGradeRequestService,
    private readonly academicYearService: AcademicYearApiService,
    private cd: ChangeDetectorRef
  ) {}

  onNewClick() {
    this.displayModal = true;
    this.selectedExamGrade = {} as ExamGradeRequestModel;
  }

  onModalClose() {
    this.displayModal = false;
  }

  ngOnInit() {
    this.getAcademicYears();
  }

  onGridEvent(
    event: GridEvent<ExamGradeRequestModel | ExamGradeRequestModel[]>
  ) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedExamGrades = [
          ...this.selectedExamGrades,
          event.data as ExamGradeRequestModel,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedExamGrades = this.selectedExamGrades.filter(item => {
          return item.id !== (event.data as ExamGradeRequestModel).id;
        });
        break;

      case GRID_ACTIONS.SELECT_MANY:
        this.selectedExamGrades = [
          ...this.selectedExamGrades,
          ...(event.data as ExamGradeRequestModel[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedExamGrades = [];
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedExamGrade = Object.assign(
          {},
          event.data as ExamGradeRequestModel
        );
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message:
            'Jeni i sigurt që doni të fshini studentin e skualifikuar të zgjedhur?',
          accept: () => {
            this.deleteExamGradeRequest(event.data as ExamGradeRequestModel);
          },
        });
        break;
    }
  }

  onFormSave(examGradeRequest: ExamGradeRequestModel) {
    if (examGradeRequest.id) {
      this.updateExamGradeRequest(examGradeRequest);
    }
    if (!examGradeRequest.id) {
      this.addExamGradeRequest(examGradeRequest);
    }
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
          this.toastService.showSuccess(
            'Kërkesa e provimit u shtua me sukses!'
          );
          this.displayModal = false;
          this.getExamGradeRequest(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të kërkesës së provimimt!'
          );
        this.cd.markForCheck();
      });
  }

  updateExamGradeRequest(examGradeRequest: ExamGradeRequestModel) {
    this.examGradeRequestService
      .updateExamGradeRequest(examGradeRequest)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            'Kërkesa e provimit u ndryshua me sukses!'
          );
          this.getExamGradeRequest(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);
        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të kërkesës së provimimt!'
          );
        this.displayModal = false;
      });
  }

  deleteExamGradeRequest(examGradeRequest: ExamGradeRequestModel) {
    this.examGradeRequestService
      .deleteExamGradeRequest(examGradeRequest.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Kërkesa e provimit u fshi me sukses!');
          this.getExamGradeRequest(this.filters as TableLazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes të kërkesës së provimimt!'
          );
      });
  }

  getAcademicYears() {
    this.academicYearService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(res => (this.academicYears = res.data));
  }
}
