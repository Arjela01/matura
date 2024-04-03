import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, forkJoin } from 'rxjs';
import {
  CreateOrUpdateMultiple,
  ExamQuestionModel,
  ExamQuestionScoreModel,
  ExamQuestionsScoreDataEntry,
  SearchOptions,
} from '@msh/shared/domain-models';
import { TableLazyLoadEvent } from 'primeng/table';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService } from 'primeng/api';
import {
  GlobalToastService,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import {
  ExamSubjectApiService,
  ExamTypeApiService,
  ExamVariantApiService,
} from '@msh/configurations/data-access-configurations';
import { ExamQuestionScoreService } from '@msh/evaluations/data-access-evaluations';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AnalyticScoreListComponent } from '../analytic-score-list/analytic-score-list.component';
import { ExamQuestionsService } from '@msh/evaluations/data-access-evaluations';
import { ExamQuestionScoreFiltersComponent } from '../../exam-questions-scores/exam-question-score-filters/exam-question-score-filters.component';
import { AnalyticScoreFiltersComponent } from '../analytic-score-filters/analytic-score-filters.component';
import { ActivatedRoute } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'msh-manage-analytic-score-edit',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ConfirmDialogModule,
    AnalyticScoreFiltersComponent,
    AnalyticScoreListComponent,
  ],
  templateUrl: './manage-analytic-score.component.html',
  styleUrls: ['./manage-analytic-score.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageAnalyticScoreComponent implements OnInit {
  private examQuestionScoreList$$ = new BehaviorSubject<
    ExamQuestionsScoreDataEntry[]
  >([]);
  examQuestionScoreList$ = this.examQuestionScoreList$$.asObservable();
  totalRecords = 0;
  filters: TableLazyLoadEvent | null = null;

  examTypeId = '';
  examVariantId = '';
  examSubjectId = '';
  totalScore = 0;
  examVariantTotalScore = 0;

  event = {
    first: 0,
    rows: 10000,
    sortOrder: 1,
    filters: {},
    globalFilter: null,
  };
  analyticScoreFilters: any = {};
  constructor(
    private readonly examQuestionScoreService: ExamQuestionScoreService,
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly examQuestionService: ExamQuestionsService,
    private readonly route: ActivatedRoute
  ) {
    this.analyticScoreFilters.examTypeId =
      this.route.snapshot.paramMap.get('examTypeId') ?? '';
    this.analyticScoreFilters.examSubjectId =
      this.route.snapshot.paramMap.get('examSubjectId') ?? '';
    this.analyticScoreFilters.examVariantId =
      this.route.snapshot.paramMap.get('examVariantId') ?? '';
    this.analyticScoreFilters.barcode =
      this.route.snapshot.paramMap.get('barcode') ?? '';
  }
  ngOnInit() {
    this.getExamQuestionScoresList(this.filters as TableLazyLoadEvent);
  }
  onGridEvent(
    event: GridEvent<ExamQuestionScoreModel | ExamQuestionScoreModel[]>
  ) {
    switch (event.action) {
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message:
            'Jeni i sigurt që doni të fshini pikët e pyetjes së provimit?',
          accept: () => {
            this.deleteExamScore(event.data as ExamQuestionScoreModel);
          },
        });
        break;
    }
  }

  getExamQuestionScoresList($event: any) {
    this.filters = Object.assign({}, $event);
    this.event.filters = {
      examSubjectID: [
        {
          value: this.analyticScoreFilters.examSubjectId,
          matchMode: 'equals',
          operator: 'and',
        },
      ],
      examTypeID: [
        {
          value: this.analyticScoreFilters.examTypeId,
          matchMode: 'equals',
          operator: 'and',
        },
      ],
      examVariantID: [
        {
          value: this.analyticScoreFilters.examVariantId,
          matchMode: 'equals',
          operator: 'and',
        },
      ],
      barcode: [
        {
          value: this.analyticScoreFilters.barcode.toUpperCase(),
          matchMode: 'equals',
          operator: 'and',
        },
      ],
    };

    forkJoin([
      this.examQuestionScoreService.loadExamQuestionScores(this.event),
      this.examQuestionService.getExamQuestionsByExamVariantId(
        this.analyticScoreFilters.examVariantId
      ),
    ]).subscribe(([examQuestionScores, examQuestions]) => {
      let totalScore = 0;
      const filteredScores = examQuestionScores.data.filter(
        (item: any) =>
          item.examQuestionScoreID !== null && item.examQuestionID !== null
      );

      filteredScores.forEach((item: any) => {
        totalScore += item.examQuestionScore;
        item.hasScore = true;
        this.examTypeId = item.examTypeName;
        this.examVariantId = item.examVariantName;
        this.examSubjectId = item.examSubjectName;
      });

      const result = examQuestions.data
        .filter((examQuestion: ExamQuestionModel) => {
          return filteredScores.some(
            (examQuestionScore: ExamQuestionScoreModel) =>
              examQuestionScore.examQuestionID === examQuestion.id
          );
        })
        .map((examQuestion: ExamQuestionModel) => {
          this.examVariantTotalScore = examQuestion.examVariantMaximumScore;

          const matchingScore = filteredScores.filter(
            (examQuestionScore: ExamQuestionScoreModel) =>
              examQuestionScore.examQuestionID === examQuestion.id
          );

          return {
            examQuestion: examQuestion,
            examQuestionScores: matchingScore,
          } as unknown as ExamQuestionsScoreDataEntry;
        });

      this.totalScore = totalScore;
      this.examQuestionScoreList$$.next(result);
    });
  }

  saveExamScore(examQuestionScore: ExamQuestionScoreModel) {
    this.examQuestionScoreService
      .save(examQuestionScore)
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            'Piket e pyetjes së provimit u shtuan me sukses!'
          );
          this.getExamQuestionScoresList(this.filters as TableLazyLoadEvent);
        } else {
          this.toastService.showError(response.errorMessage);
        }
        if (response.isBadRequest) {
          this.toastService.showError(
            'Ndodhi një problem gjatë shtimit të pikeve!'
          );
        }
      });
  }
  updateExamScore(examQuestionScore: ExamQuestionScoreModel) {
    this.examQuestionScoreService
      .update(examQuestionScore)
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            'Piket e pyetjes së provimit u ndryshuan me sukses!'
          );
          this.getExamQuestionScoresList(this.filters as TableLazyLoadEvent);
        } else {
          this.toastService.showError(response.errorMessage);
        }
        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së rezultatit të provimit!'
          );
      });
  }
  saveExamQuestionScoreChanges(rowData: any) {
    if (rowData.examQuestionScores && rowData.examQuestionScores.length > 0) {
      const examQuestionScore: ExamQuestionScoreModel = {
        id: rowData.examQuestionScores[0].examQuestionScoreID,
        examQuestionID: rowData.examQuestion.id,
        score: rowData.examQuestionScores[0].examQuestionScore,
        examScoreID: rowData.examQuestionScores[0].examScoreID,
      };
      if (!rowData.examQuestionScores[0].hasScore) {
        this.saveExamScore(examQuestionScore);
      } else {
        this.updateExamScore(examQuestionScore);
      }
    }
  }
  deleteExamScore(examQuestionScore: ExamQuestionScoreModel) {
    this.examQuestionScoreService
      .delete(examQuestionScore)
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Rezultati i provimit u fshi me sukses!');
          this.getExamQuestionScoresList(this.filters as TableLazyLoadEvent);
        }
        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes së rezultatit të provimit!'
          );
      });
  }
}
