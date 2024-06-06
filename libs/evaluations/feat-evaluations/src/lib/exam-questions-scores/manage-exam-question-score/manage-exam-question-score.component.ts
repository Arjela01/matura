import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import {
  ExamQuestionModel,
  ExamQuestionScore,
  ExamQuestionScoreCreateUpdateModel,
  ExamQuestionScoreCreateUpdateMultipleCommand,
  ExamQuestionScoreTotal,
  ExamQuestionsScoreDataEntry,
} from '@msh/shared/domain-models';
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
  ExamQuestionScoreTotalsService,
  ExamQuestionsService,
} from '@msh/evaluations/data-access-evaluations';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ExamQuestionScoreFiltersComponent } from '../exam-question-score-filters/exam-question-score-filters.component';
import { ExamQuestionScoreGridComponent } from '../exam-question-score-grid/exam-question-score-grid.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MessagesModule } from 'primeng/messages';
import { RippleModule } from 'primeng/ripple';

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
    MessagesModule,
    RippleModule,
    RouterLink,
  ],
  templateUrl: './manage-exam-question-score.component.html',
  styleUrls: ['./manage-exam-question-score.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageExamQuestionsScoreComponent implements OnInit {
  @ViewChild(ExamQuestionScoreFiltersComponent)
  scoreFilterComponent!: ExamQuestionScoreFiltersComponent;

  dataEntryItems: ExamQuestionsScoreDataEntry[] = [];

  examQuestionScoreTotal: ExamQuestionScoreTotal = {};

  totalRecords = 0;
  filters: ExamQuestionScoreTotal = {};
  examSubjects: DropdownModel<string>[] = [];
  examTypes: DropdownModel<number>[] = [];
  examVariants: DropdownModel<string>[] = [];
  academicYearId = 0;

  id: string | null = null;
  isEditMode = false;
  showForm = true;
  totalScore = 0;
  examVariantTotalScore = 0;
  isSaving = false;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly examSubjectService: ExamSubjectApiService,
    private readonly examVariantService: ExamVariantApiService,
    private readonly examQuestionScoreService: ExamQuestionScoreService,
    private readonly examQuestionScoreTotalsService: ExamQuestionScoreTotalsService,
    private readonly toastService: GlobalToastService,
    private readonly examQuestionService: ExamQuestionsService,
    private readonly examTypeService: ExamTypeApiService,
    private elementRef: ElementRef,
    private readonly route: ActivatedRoute,
    private readonly cd: ChangeDetectorRef
  ) {
    this.id = route.snapshot.params['id'];
    this.isEditMode = !!this.id;

    const academicYearString = localStorage.getItem('academicYear');
    if (academicYearString) {
      const academicYear = JSON.parse(academicYearString);
      this.academicYearId = academicYear.id;
    }
  }

  ngOnInit() {
    if (this.id != null) {
      this.examQuestionScoreTotalsService
        .getById(this.id)
        .subscribe(response => {
          if (response.data != null) {
            this.examQuestionScoreTotal = response.data;
            this.getExamSubjectDropdown(this.examQuestionScoreTotal);
            this.getExamVariantDropdown(this.examQuestionScoreTotal);
            this.getExamQuestionScoresList(this.examQuestionScoreTotal);
          } else {
            this.showForm = false;
          }
          this.cd.markForCheck();
        });
    }
    this.getExamTypeDropdown();
  }

  getExamTypeDropdown() {
    this.examTypeService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examTypes = response.data;
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
        this.examSubjects = response.data;
        this.cd.markForCheck();
      });
  }

  getExamVariantDropdown($event: any) {
    this.examVariantService
      .forExamSubject($event.examSubjectId)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examVariants = response.data;
        this.cd.markForCheck();
      });
  }

  calculateTotalScore() {
    this.totalScore = this.dataEntryItems.reduce(
      (acc: number, rowData: ExamQuestionsScoreDataEntry) =>
        acc + (rowData.examQuestionScore.score ?? 0),
      0
    );
    this.cd.markForCheck();
  }

  checkBarcode($event: ExamQuestionScoreTotal) {
    this.examQuestionScoreTotalsService
      .isBarcodeFree($event.barcode)
      .subscribe(response => {
        if (response.data) {
          this.toastService.showError('Barkodi është hedhur tashmë!');
        }
      });
  }

  focusFirstInput() {
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
    this.totalScore = 0;
    for (const item of this.dataEntryItems ?? []) {
      item.examQuestionScore = {};
    }
  }

  getExamQuestionScoresList($event: ExamQuestionScoreTotal) {
    this.filters = Object.assign({}, $event);
    forkJoin([
      this.examQuestionScoreService.loadExamQuestionScoresByTotalId($event.id),
      this.examQuestionService.getExamQuestionsByExamVariantId(
        $event.examVariantId
      ),
    ]).subscribe(([examQuestionScores, examQuestions]) => {
      const result = examQuestions.data.map(
        (examQuestion: ExamQuestionModel) => {
          this.examVariantTotalScore = examQuestion.examVariantMaximumScore;
          const matchingScore =
            examQuestionScores.data.find(
              (examQuestionScore: ExamQuestionScore) =>
                examQuestionScore.examQuestionId == examQuestion.id
            ) ?? ({} as ExamQuestionScore);
          return {
            examQuestion: examQuestion,
            examQuestionScore: matchingScore,
          } as unknown as ExamQuestionsScoreDataEntry;
        }
      );
      result.sort(
        (a: ExamQuestionsScoreDataEntry, b: ExamQuestionsScoreDataEntry) => {
          return a.examQuestion.index - b.examQuestion.index;
        }
      );
      this.dataEntryItems = result ?? [];
      this.calculateTotalScore();
    });
  }

  saveExamScores(examQuestionScores: ExamQuestionScoreCreateUpdateModel[]) {
    if (this.isSaving) return;
    this.isSaving = true;

    const valuesToSend = {
      examVariantId: this.examQuestionScoreTotal.examVariantId,
      examQuestionScoreCreateUpdateModels: examQuestionScores,
      testNumber: this.examQuestionScoreTotal.testNumber,
      barcode: this.examQuestionScoreTotal.barcode,
      examQuestionScoreTotalId: this.examQuestionScoreTotal.id,
    } as ExamQuestionScoreCreateUpdateMultipleCommand;
    this.examQuestionScoreService
      .createOrUpdateMultiple(valuesToSend)
      .subscribe(response => {
        this.isSaving = false;
        if (response.isSuccessful) {
          if (!this.isEditMode) {
            this.toastService.showSuccess(
              'Piket analitike u shtuan me sukses!'
            );
            this.clearInputValues();
            this.scoreFilterComponent.clearFields();
          } else {
            this.toastService.showSuccess(
              'Piket analitike u ruajtën me sukses!'
            );
          }
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

  deleteExamQuestionScoreTotal() {
    this.confirmationService.confirm({
      message: 'Jeni i sigurt që doni të fshini pikët analitike?',
      accept: () => {
        this.examQuestionScoreTotalsService
          .delete(this.id)
          .subscribe(response => {
            if (response.isSuccessful) {
              this.toastService.showSuccess(
                'Pikët analitike u fshinë me sukses!'
              );
              if (this.filters) this.getExamQuestionScoresList(this.filters);
            } else {
              this.toastService.showError(response.errorMessage);
            }
            if (response.isBadRequest) {
              this.toastService.showError(
                'Ndodhi një problem gjatë fshirjes së pikëve analitikee!'
              );
            }
          });
      },
    });
  }
}
