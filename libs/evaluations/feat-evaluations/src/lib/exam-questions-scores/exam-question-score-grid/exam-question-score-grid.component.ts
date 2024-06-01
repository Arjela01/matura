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
import { ExamQuestionScore, ExamQuestionScoreCreateUpdateModel } from '@msh/shared/domain-models';
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
  @Output() saveScores = new EventEmitter<ExamQuestionScoreCreateUpdateModel[]>();
  @Output() calculate = new EventEmitter<any>();
  @Output() gridEvent = new EventEmitter<
    GridEvent<ExamQuestionScore | ExamQuestionScore[]>
  >();
  inputScores: { [questionId: number]: number } = {};

  updateInputScore(questionId: number, score: number) {
    this.inputScores[questionId] = score;
  }

  onExamScoreAddOrUpdate(action: ScoreActions): void {
    if (action === ScoreActions.SAVE) {
      const saveList = this.examQuestionScoreList.map(rowData => {
        return {
          examQuestionId: rowData.examQuestion.id,
          score: rowData.examQuestionScore.score,
        } as ExamQuestionScoreCreateUpdateModel;
      });

      this.saveScores.emit(saveList);
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
    const totalRows = this.examQuestionScoreList.length;
    if (rowIndex === totalRows) {
      const firstButton = document.querySelector(
        '.analytical-score-save-btn'
      ) as HTMLButtonElement | null;

      if (firstButton) {
        firstButton.focus();
      }
    } else {
      const nextRowIndex = rowIndex + 1;
      const nextInput = document.querySelector(
        `.analytical-score-grid tr:nth-child(${nextRowIndex}) input`
      );
      if (nextInput) {
        (nextInput as HTMLInputElement).focus();
      }
    }
    return false;
  }

  protected readonly ScoreActions = ScoreActions;
}
