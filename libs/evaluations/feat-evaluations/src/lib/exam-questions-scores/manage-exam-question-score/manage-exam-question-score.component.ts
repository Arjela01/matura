import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, forkJoin } from 'rxjs';
import {
  CreateOrUpdateMultiple,
  ExamQuestionModel,
  ExamQuestionScoreModel,
  ExamQuestionsScoreDataEntry,
} from '@msh/shared/domain-models';
import { TableLazyLoadEvent } from 'primeng/table';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService } from 'primeng/api';
import { GlobalToastService } from '@msh/shared/util-shared';
import {
  ExamSubjectApiService,
  ExamTypeApiService,
  ExamVariantApiService,
} from '@msh/configurations/data-access-configurations';
import {
  ExamQuestionScoreService,
  ExamQuestionsService,
} from '@msh/evaluations/data-access-evaluations';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ExamQuestionScoreFiltersComponent } from '../exam-question-score-filters/exam-question-score-filters.component';
import { ExamQuestionScoreGridComponent } from '../exam-question-score-grid/exam-question-score-grid.component';

@UntilDestroy()
@Component({
  selector: 'msh-manage-exam-question-score',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ConfirmDialogModule,
    ExamQuestionScoreFiltersComponent,
    ExamQuestionScoreGridComponent,
  ],
  templateUrl: './manage-exam-question-score.component.html',
  styleUrls: ['./manage-exam-question-score.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageExamQuestionsScoreComponent implements OnInit {
  @ViewChild(ExamQuestionScoreFiltersComponent)
  scoreFilterComponent!: ExamQuestionScoreFiltersComponent;

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
  totalScore = 0;
  examVariantTotalScore = 0;
  barcode: any;
  academicYearId = 0;
  testNumber = 0;

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
    private readonly toastService: GlobalToastService,
    private readonly examQuestionService: ExamQuestionsService,
    private readonly examTypeService: ExamTypeApiService,
    private elementRef: ElementRef
  ) {
    const academicYearString = localStorage.getItem('academicYear');
    if (academicYearString) {
      const academicYear = JSON.parse(academicYearString);
      this.academicYearId = academicYear.id;
    }
  }

  ngOnInit() {
    this.getExamTypeDropdown();
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
      .loadDropDownListNotMappedToProfiles(
        this.academicYearId,
        undefined,
        $event.examTypeId,
        undefined
      )
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examSubject = response.data;
      });
  }

  getExamVariantDropdown($event: any) {
    this.examVariantService
      .forExamSubject($event.examSubjectId, this.academicYearId)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examVariant = response.data;
      });
  }

  calculateTotalScore() {
    this.totalScore = this.examQuestionScoreList$$
      .getValue()
      .reduce((acc, rowData: any) => {
        return acc + rowData.examQuestionScores[0].examQuestionScore;
      }, 0) as any;
  }

  private focusFirstInput() {
    setTimeout(() => {
      const firstRowInput = this.elementRef.nativeElement.querySelector(
        'tbody tr:first-child input'
      );
      if (firstRowInput) {
        firstRowInput.focus();
      }
    }, 0);
  }

  private clearInputValues() {
    const inputs =
      this.elementRef.nativeElement.querySelectorAll('tbody input');
    inputs.forEach((input: HTMLInputElement) => {
      input.value = '';
    });
  }

  getExamQuestionScoresList($event: any) {
    this.filters = Object.assign({}, $event);
    this.examVariantId = $event.examVariantId;
    this.barcode = $event.barcode;
    this.testNumber = $event.testNumber;
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
      barcode: [
        {
          value: $event.barcode,
          matchMode: 'equals',
          operator: 'and',
        },
      ],
      testNumber: [
        {
          value: $event.testNumber,
          matchMode: 'equals',
          operator: 'and',
        },
      ],
    };
    forkJoin([
      this.examQuestionScoreService.loadExamQuestionScores(this.event),
      this.examQuestionService.getExamQuestionsByExamVariantId(
        $event.examVariantId || $event
      ),
    ]).subscribe(([examQuestionScores, examQuestions]) => {
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
      this.examQuestionScoreList$$.next(result);
      let scoreFound = false;
      for (const item of result) {
        for (const scoreObj of item.examQuestionScores) {
          if (scoreObj.examQuestionScore) {
            scoreFound = true;
            break;
          }
        }
        if (scoreFound) {
          break;
        }
      }

      if (scoreFound) {
        this.toastService.showInfo(
          'Për këtë barkod janë rregjistruar tashmë pikët'
        );
      }
      this.calculateTotalScore();
      this.focusFirstInput();
    });
  }

  saveExamScore(examQuestionScore: CreateOrUpdateMultiple) {
    const valuesToSend = {
      examVariantId: this.examVariantId,
      academicYearId: this.academicYearId,
      examQuestionScoreCreateUpdateModels: examQuestionScore,
      testNumber: this.testNumber,
      barcode: this.barcode.toUpperCase(),
    } as unknown as CreateOrUpdateMultiple;
    this.examQuestionScoreService
      .createOrUpdateMultiple(valuesToSend)
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Piket analitike u shtuan me sukses!');
          this.clearInputValues();
          this.scoreFilterComponent.clearFields();
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

  deleteExamScore(examQuestionScore: CreateOrUpdateMultiple) {
    const valuesToSend = {
      examQuestionIds: examQuestionScore,
      barcode: this.barcode.toUpperCase(),
    } as unknown as CreateOrUpdateMultiple;
    this.examQuestionScoreService
      .deleteMultiple(valuesToSend)
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Rezultati i provimit u fshi me sukses!');
          this.getExamQuestionScoresList(this.filters as TableLazyLoadEvent);
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
}
