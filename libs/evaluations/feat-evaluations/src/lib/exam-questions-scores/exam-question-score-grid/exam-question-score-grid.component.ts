import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamQuestionScoreModel } from '@msh/shared/domain-models';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { UntilDestroy } from '@ngneat/until-destroy';
import { TooltipModule } from 'primeng/tooltip';
import { GRID_ACTIONS, GridEvent } from '@msh/shared/util-shared';

enum ScoreActions {
  SAVE,
  CLEAN,
}

@UntilDestroy()
@Component({
  selector: 'msh-exam-question-score-grid',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    PaginatorModule,
    TooltipModule,
  ],
  templateUrl: './exam-question-score-grid.component.html',
  styleUrls: ['./exam-question-score-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamQuestionScoreGridComponent {
  @ViewChild('scoreInput') scoreInputs!: ElementRef<HTMLInputElement>[];
  @Input() examQuestionScoreList: any[] = [];
  @Input() totalRecords = 0;
  @Input() totalScore = 0;
  @Input() examVariantMaximumScore = 0;
  @Input() examVariantId = '';
  @Input() loading = false;
  @Output() writingScoreChange = new EventEmitter<any>();
  @Output() deleteMultiple = new EventEmitter<any>();
  @Output() calculate = new EventEmitter<any>();
  @Output() gridEvent = new EventEmitter<
    GridEvent<ExamQuestionScoreModel | ExamQuestionScoreModel[]>
  >();
  inputScores: { [questionId: number]: number } = {};

  onDeleteClick(examQuestionScore: any) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: examQuestionScore,
    } as GridEvent<ExamQuestionScoreModel>);
  }

  updateInputScore(questionId: number, score: number) {
    this.inputScores[questionId] = score;
  }

  onExamScoreAddOrUpdate(action: ScoreActions): void {
    const deletedIDs: number[] = [];

    if (action === ScoreActions.CLEAN) {
      this.examQuestionScoreList.forEach(rowData => {
        if (rowData.examQuestionScores.length > 0) {
          deletedIDs.push(rowData.examQuestion.id);
        }
      });
    }

    if (action === ScoreActions.SAVE) {
      const updatedScores: ExamQuestionScoreModel[] = [];
      this.examQuestionScoreList.forEach(rowData => {
        if (rowData) {
          const examQuestionScore: ExamQuestionScoreModel = {
            examQuestionID: rowData.examQuestion.id,
            maximumScore: rowData.examQuestion.questionMaximumScore,
            score:
              rowData.examQuestionScores[0]?.examQuestionScore ||
              this.inputScores[rowData.examQuestion.id],
            examScoreID: rowData.examQuestionScores[0]?.examScoreID,
          };
          updatedScores.push(examQuestionScore);
        }
      });

      this.writingScoreChange.emit(updatedScores);
    } else if (action === ScoreActions.CLEAN) {
      this.deleteMultiple.emit(deletedIDs);
    }
  }

  onRowChange(examQuestionScore: any) {
    this.calculate.emit(examQuestionScore);
  }

  limitToTwoDigits(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.value && input.value.length > 2) {
      input.value = input.value.slice(0, 2);
    }
  }

  focusNextRow(rowIndex: number) {
    const nextRowIndex = rowIndex + 1;
    const nextInput = document.querySelector(
      `tr:nth-child(${nextRowIndex}) input`
    );
    if (nextInput) {
      (nextInput as HTMLInputElement).focus();
    }
  }

  protected readonly ScoreActions = ScoreActions;
}
