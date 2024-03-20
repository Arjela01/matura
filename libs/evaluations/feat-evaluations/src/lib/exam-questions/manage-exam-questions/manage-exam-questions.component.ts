import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { ExamQuestionModel, ExamType } from '@msh/shared/domain-models';
import { TableLazyLoadEvent } from 'primeng/table';
import { ConfirmationService, SharedModule } from 'primeng/api';
import {
  GlobalToastService,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ExamQuestionsService } from '@msh/evaluations/data-access-evaluations';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ExamQuestionsGridComponent } from '../exam-questions-grid/exam-questions-grid.component';
import { ExamQuestionsFormComponent } from '../exam-questions-form/exam-questions-form.component';
import { ActivatedRoute } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'msh-manage-exam-question-score',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
    RippleModule,
    SharedModule,
    ExamQuestionsGridComponent,
    ExamQuestionsFormComponent,
  ],
  templateUrl: './manage-exam-questions.component.html',
  styleUrls: ['./manage-exam-questions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageExamQuestionsComponent {
  private examQuestions$$ = new BehaviorSubject<ExamQuestionModel[]>([]);
  examQuestions$ = this.examQuestions$$.asObservable();
  filters: TableLazyLoadEvent | null = null;

  totalRecords = 0;
  examVariantId: any;
  selectedExamQuestion: ExamQuestionModel | null = null;

  displayModal = false;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly examQuestionService: ExamQuestionsService,
    private readonly route: ActivatedRoute
  ) {
    this.examVariantId = this.route.snapshot.paramMap.get('id');
  }

  event = {
    first: 0,
    rows: 10000,
    sortOrder: 1,
    filters: {},
    globalFilter: null,
  };

  onNewClick() {
    this.displayModal = true;
    this.selectedExamQuestion = {} as ExamQuestionModel;
  }

  onGridEvent(event: GridEvent<ExamQuestionModel | ExamQuestionModel[]>) {
    switch (event.action) {
      case GRID_ACTIONS.EDIT:
        this.selectedExamQuestion = Object.assign(
          {},
          event.data as ExamQuestionModel
        );
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt që doni të fshini pyetjen e zgjedhur?',
          accept: () => {
            this.deleteExamQuestion(event.data as ExamQuestionModel);
          },
        });
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
  }

  onFormSave(examQuestion: ExamQuestionModel) {
    if (examQuestion.id) {
      this.updateExamQuestion(examQuestion);
    }
    if (!examQuestion.id) {
      this.addExamQuestion(examQuestion);
    }
  }

  getExamQuestions($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.event.filters = {
      examVariantID: [
        {
          value: this.examVariantId,
          matchMode: 'equals',
          operator: 'and',
        },
      ],
    };
    this.examQuestionService
      .loadData(this.event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examQuestions$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  addExamQuestion(examQuestion: ExamQuestionModel) {
    const valuesToSend: ExamQuestionModel = {
      ...examQuestion,
      examVariantID: this.examVariantId,
    };
    this.examQuestionService
      .save(valuesToSend)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Pyetja e provimit u shtua me sukses!');
          this.displayModal = false;
          this.getExamQuestions(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);
        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së pyetjes së provimit!'
          );
      });
  }

  updateExamQuestion(examQuestion: ExamQuestionModel) {
    this.examQuestionService
      .update(examQuestion)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            'Pyetja e provimit u ndryshua me sukses!'
          );
          this.displayModal = false;
          this.getExamQuestions(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);
        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së pyetjes së provimit!'
          );
      });
  }

  deleteExamQuestion(examQuestion: ExamQuestionModel) {
    this.examQuestionService
      .delete(examQuestion.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Pyetja e provimit u fshi me sukses!');
          this.getExamQuestions(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes së pyetjes së provimit!'
          );
      });
  }
}
