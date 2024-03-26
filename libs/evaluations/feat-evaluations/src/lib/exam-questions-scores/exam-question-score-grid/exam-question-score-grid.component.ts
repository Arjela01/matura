import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamScores } from '@msh/shared/domain-models';
import { GRID_ACTIONS, GridEvent } from '@msh/shared/util-shared';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'msh-exam-question-score-grid',
  standalone: true,
  imports: [CommonModule, ButtonModule, InputTextModule, PaginatorModule],
  templateUrl: './exam-question-score-grid.component.html',
  styleUrls: ['./exam-question-score-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamQuestionScoreGridComponent {
  @Input() examQuestionScoreList: any[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  @Input() examSubjectName: any;
  @Input() examTypeName: any;
  @Input() examVariantName: any;
  @Output() gridEvent = new EventEmitter<
    GridEvent<ExamScores | ExamScores[]>
  >();
  @Output() writingScoreChange = new EventEmitter<any>();

  onDeleteClick(examQuestionScore: any) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: examQuestionScore,
    } as GridEvent<ExamScores>);
  }
  onExamScoreAddOrUpdate(examQuestionScore: any) {
    this.writingScoreChange.emit(examQuestionScore);
  }
}
