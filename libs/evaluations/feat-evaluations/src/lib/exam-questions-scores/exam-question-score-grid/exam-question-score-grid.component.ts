import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamQuestionScoreModel } from '@msh/shared/domain-models';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { UntilDestroy } from '@ngneat/until-destroy';
import { TooltipModule } from 'primeng/tooltip';

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
  @Input() loading = false;
  @Output() writingScoreChange = new EventEmitter<any>();
  @Output() deleteMultiple = new EventEmitter<any>();
  @Output() calculate = new EventEmitter<any>();

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
        if (rowData.examQuestionScores.length > 0) {
          const examQuestionScore: ExamQuestionScoreModel = {
            examQuestionID: rowData.examQuestion.id,
            maximumScore:
              rowData.examQuestionScores[0].examQuestionMaximumScore,
            score: rowData.examQuestionScores[0].examQuestionScore,
            examScoreID: rowData.examQuestionScores[0].examScoreID,
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

  protected readonly ScoreActions = ScoreActions;
}
