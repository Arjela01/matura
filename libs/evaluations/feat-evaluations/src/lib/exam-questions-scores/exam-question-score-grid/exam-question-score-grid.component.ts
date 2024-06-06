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
import {
  ExamQuestionScore,
  ExamQuestionScoreCreateUpdateModel,
} from '@msh/shared/domain-models';
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
  @Input() examQuestionScoreList: any[] = [];
  @Input() totalRecords = 0;
  @Input() totalScore = 0;
  @Input() examVariantMaximumScore = 0;
  @Input() examVariantId = '';
  @Input() loading = false;
  @Output() saveScores = new EventEmitter<
    ExamQuestionScoreCreateUpdateModel[]
  >();
  @Output() calculate = new EventEmitter();
  @Output() gridEvent = new EventEmitter<
    GridEvent<ExamQuestionScore | ExamQuestionScore[]>
  >();

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

  onRowChange() {
    this.calculate.emit();
  }

  limitToTwoDigits(rowIndex: number, event: any): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    if (value.length > 2) {
      value = value.slice(0, 2);
    }
    input.value = value;
    if (rowIndex >= 0 && rowIndex < this.examQuestionScoreList.length) {
      this.examQuestionScoreList[rowIndex].examQuestionScore.score = value
        ? parseInt(value, 10)
        : null;
      this.onRowChange();
    }
  }

  onInputBlur(event: any): void {
    const input = event.target as HTMLInputElement;
    input.classList.remove('ng-invalid');
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
