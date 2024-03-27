import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, forkJoin, map } from 'rxjs';
import {
  ExamQuestionModel,
  ExamQuestionScoreModel,
  ExamQuestionsScoreDataEntry,
  ExamScore,
  ExamScores,
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
import {
  ExamQuestionScoreService,
  ExamScoreApiService,
} from '@msh/evaluations/data-access-evaluations';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ExamScoreTabularDataEntryFiltersComponent } from '../../exam-score-tabular-data-entry/exam-score-tabular-data-entry-filters/exam-score-tabular-data-entry-filters.component';
import { ExamScoreTabularDataEntryListComponent } from '../../exam-score-tabular-data-entry/exam-score-tabular-data-entry-list/exam-score-tabular-data-entry-list.component';
import { ExamQuestionScoreFiltersComponent } from '../exam-question-score-filters/exam-question-score-filters.component';
import { ExamQuestionScoreGridComponent } from '../exam-question-score-grid/exam-question-score-grid.component';
import { ExamQuestionsService } from '@msh/evaluations/data-access-evaluations';

@UntilDestroy()
@Component({
  selector: 'msh-manage-exam-question-score',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ConfirmDialogModule,
    ExamScoreTabularDataEntryFiltersComponent,
    ExamScoreTabularDataEntryListComponent,
    ExamQuestionScoreFiltersComponent,
    ExamQuestionScoreGridComponent,
  ],
  templateUrl: './manage-exam-question-score.component.html',
  styleUrls: ['./manage-exam-question-score.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageExamQuestionsScoreComponent implements OnInit {
  private examQuestionScoreList$$ = new BehaviorSubject<
    ExamQuestionsScoreDataEntry[]
  >([]);
  examQuestionScoreList$ = this.examQuestionScoreList$$.asObservable();
  totalRecords = 0;
  filters: TableLazyLoadEvent | null = null;
  examSubject: DropdownModel<string>[] = [];
  examType: DropdownModel<number>[] = [];
  examVariant: DropdownModel<string>[] = [];
  examVariantId: any;
  examSubjectId: any;

  event = {
    first: 0,
    rows: 10000,
    sortOrder: 1,
    filters: {},
    globalFilter: null,
  };

  constructor(
    private readonly examSubjectService: ExamSubjectApiService,
    private readonly examVariantService: ExamVariantApiService,
    private readonly examQuestionScoreService: ExamQuestionScoreService,
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly examQuestionService: ExamQuestionsService,
    private readonly examTypeService: ExamTypeApiService,
    private readonly examScoreService: ExamScoreApiService
  ) {}

  ngOnInit() {
    this.getExamTypeDropdown();
  }

  onGridEvent(event: GridEvent<ExamScores | ExamScores[]>) {
    switch (event.action) {
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message:
            'Jeni i sigurt që doni të fshini pikët e pyetjes së provimit?',
          accept: () => {
            this.deleteExamScore(event.data as ExamScores);
          },
        });
        break;
    }
  }

  getExamTypeDropdown() {
    this.examTypeService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examType = response.data;
      });
  }
  getExamSubjectDropdown($event: any) {
    this.examSubjectService
      .forExamType($event.examTypeId)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examSubject = response.data;
      });
  }
  getExamVariantDropdown($event: any) {
    const academicYearString = localStorage.getItem('academicYear');
    if (academicYearString) {
      const academicYear = JSON.parse(academicYearString);
      const academicYearId = academicYear.id;
      this.examVariantService
        .forExamSubject($event.examSubjectId, academicYearId)
        .pipe(untilDestroyed(this))
        .subscribe(response => {
          this.examVariant = response.data;
        });
    }
  }

  getExamQuestionScoresList($event: any) {
    this.filters = Object.assign({}, $event);
    this.examVariantId = $event.examVariantId;
    this.event.filters = {
      examSubjectID: [
        {
          value: $event.examSubjectId,
          matchMode: 'equals',
          operator: 'and',
        },
      ],
      examTypeID: [
        {
          value: $event.examTypeId,
          matchMode: 'equals',
          operator: 'and',
        },
      ],
      examVariantID: [
        {
          value: $event.examVariantId,
          matchMode: 'equals',
          operator: 'and',
        },
      ],
    };
    forkJoin([
      this.examScoreService.loadExamScores(this.event),
      this.examQuestionScoreService.loadExamQuestionScores(this.event),
      this.examQuestionService.getExamQuestionsByExamVariantId(
        $event.examVariantId || $event
      ),
    ]).subscribe(([examScores, examQuestionScores, examQuestions]) => {
      const result = examQuestions.data.map(
        (examQuestion: ExamQuestionModel) => {
          const matchingScore = examQuestionScores.data.filter(
            (examQuestionScore: ExamQuestionScoreModel) =>
              examQuestionScore.examQuestionID == examQuestion.id
          );

          examQuestionScores.data.map((item: any) => {
            if (item.examQuestionScore) {
              item.hasScore = true;
            }
          });
          return {
            examScores: examScores.data.find(
              (examScore: ExamScore) => examScore.barcode === $event.barcode
            ),
            examQuestion: examQuestion,
            examQuestionScores: matchingScore,
          } as unknown as ExamQuestionsScoreDataEntry;
        }
      );
      this.examQuestionScoreList$$.next(result);
      if (examQuestionScores != undefined) {
        setTimeout(() => {
          document
            .querySelector<HTMLInputElement>(
              `[examQuestionId='${examQuestionScores.id}']`
            )
            ?.focus();
        }, 100);
      }
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
            'Piket e pyetjes së provimit u ndryshua me sukses!'
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
        examScoreID:
          rowData.examQuestionScores[0].examScoreID || rowData.examScores.id,
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
