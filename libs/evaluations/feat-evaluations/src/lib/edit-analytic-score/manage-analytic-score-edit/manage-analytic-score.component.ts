import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, forkJoin } from 'rxjs';
import {
  CreateOrUpdateMultiple,
  ExamQuestionModel,
  ExamQuestionScoreModel,
  ExamQuestionsScoreDataEntry,
} from '@msh/shared/domain-models';
import { TableLazyLoadEvent } from 'primeng/table';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ConfirmationService } from 'primeng/api';
import {
  GlobalToastService,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { ExamQuestionScoreService } from '@msh/evaluations/data-access-evaluations';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ExamQuestionsService } from '@msh/evaluations/data-access-evaluations';
import { AnalyticScoreFiltersComponent } from '../analytic-score-filters/analytic-score-filters.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamQuestionScoreGridComponent } from '../../exam-questions-scores/exam-question-score-grid/exam-question-score-grid.component';

@UntilDestroy()
@Component({
  selector: 'msh-manage-analytic-score-edit',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ConfirmDialogModule,
    AnalyticScoreFiltersComponent,
    ExamQuestionScoreGridComponent,
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
    private readonly examQuestionScoreApiService: ExamQuestionScoreService,
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly examQuestionService: ExamQuestionsService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    this.analyticScoreFilters.examTypeId =
      this.route.snapshot.paramMap.get('examTypeId') ?? '';
    this.analyticScoreFilters.examSubjectId =
      this.route.snapshot.paramMap.get('examSubjectId') ?? '';
    this.analyticScoreFilters.examVariantId =
      this.route.snapshot.paramMap.get('examVariantId') ?? '';
    this.analyticScoreFilters.testNumber =
      this.route.snapshot.paramMap.get('testNumber') ?? '';
    this.analyticScoreFilters.barcode =
      this.route.snapshot.paramMap.get('barcode') ?? '';
  }
  ngOnInit() {
    this.getExamQuestionScoresList(this.filters as TableLazyLoadEvent);
  }

  onBackButtonClick() {
    this.router.navigate(['evaluations/analytic-scores-grid']);
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
      testNumber: [
        {
          value: this.analyticScoreFilters.testNumber,
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
      this.examQuestionScoreApiService.loadExamQuestionScores(this.event),
      this.examQuestionService.getExamQuestionsByExamVariantId(
        this.analyticScoreFilters.examVariantId
      ),
    ]).subscribe(([examQuestionScores, examQuestions]) => {
      let totalScore = 0;

      examQuestionScores.data.forEach((item: any) => {
        totalScore += item.examQuestionScore;
        item.hasScore = true;
        this.examTypeId = item.examTypeName;
        this.examVariantId = item.examVariantName;
        this.examSubjectId = item.examSubjectName;
      });

      const result = examQuestions.data.map(
        (examQuestion: ExamQuestionModel) => {
          this.examVariantTotalScore = examQuestion.examVariantMaximumScore;
          const matchingScore = examQuestionScores.data.filter(
            (examQuestionScore: ExamQuestionScoreModel) =>
              examQuestionScore.examQuestionID == examQuestion.id
          );
          return {
            examQuestion: examQuestion,
            examQuestionScores: matchingScore,
          } as unknown as ExamQuestionsScoreDataEntry;
        }
      );

      result.sort(
        (a: ExamQuestionsScoreDataEntry, b: ExamQuestionsScoreDataEntry) => {
          return a.examQuestion.index - b.examQuestion.index;
        }
      );
      this.totalScore = totalScore;
      this.examQuestionScoreList$$.next(result);
    });
  }

  saveExamScore(examQuestionScore: CreateOrUpdateMultiple) {
    const academicYearString = localStorage.getItem('academicYear');
    if (academicYearString) {
      const academicYear = JSON.parse(academicYearString);
      const academicYearId = academicYear.id;
      const valuesToSend = {
        academicYearId: academicYearId,
        examQuestionScoreCreateUpdateModels: examQuestionScore,
        barcode: this.analyticScoreFilters.barcode,
        testNumber: this.analyticScoreFilters.testNumber,
      } as unknown as CreateOrUpdateMultiple;
      this.examQuestionScoreApiService
        .createOrUpdateMultiple(valuesToSend)
        .subscribe(response => {
          if (response.isSuccessful) {
            this.toastService.showSuccess(
              'Piket analitike u ndryshuan me sukses!'
            );
            this.getExamQuestionScoresList(this.filters as TableLazyLoadEvent);
          } else {
            this.toastService.showError(response.errorMessage);
          }
          if (response.isBadRequest) {
            this.toastService.showError(
              'Ndodhi një problem gjatë ndryshimit të pikeve!'
            );
          }
        });
    }
  }

  deleteMultipleExamScore(examQuestionScore: CreateOrUpdateMultiple) {
    const valuesToSend = {
      examQuestionIds: examQuestionScore,
      barcode: this.analyticScoreFilters.barcode.toUpperCase(),
    } as unknown as CreateOrUpdateMultiple;
    this.examQuestionScoreApiService
      .deleteMultiple(valuesToSend)
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Rezultati i provimit u fshi me sukses!');
          this.router.navigate(['/evaluations/analytic-scores-grid']);
        } else {
          this.toastService.showError(response.errorMessage);
        }
        if (response.isBadRequest) {
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes së rezultatit të provimit!'
          );
        }
      });
  }
  deleteExamScore(examQuestionScore: ExamQuestionScoreModel) {
    this.examQuestionScoreApiService
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

  calculateTotalScore() {
    this.totalScore = this.examQuestionScoreList$$
      .getValue()
      .reduce((acc, rowData: any) => {
        return acc + rowData.examQuestionScores[0].examQuestionScore;
      }, 0) as any;
  }
}
