import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';
import {
  ColumnFilterDirective,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { ExamScore } from '@msh/shared/domain-models';

@Component({
  selector: 'msh-exam-score-grid',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
    RippleModule,
    ColumnFilterDirective,
  ],
  templateUrl: './exam-scores-grid.component.html',
  styleUrls: ['./exam-scores-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamScoresGridComponent {
  @Input() examScores: ExamScore[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  //Keep it local state because of Table Header checkbox not syncing
  selectedExamScores: ExamScore[] = [];

  @Output() gridEvent = new EventEmitter<GridEvent<ExamScore | ExamScore[]>>();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  onEditClick(examScore: ExamScore) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: examScore,
    } as GridEvent<ExamScore>);
  }

  onDeleteClick(examScore: ExamScore) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: examScore,
    } as GridEvent<ExamScore>);
  }

  onSelectAllClick() {
    if (this.selectedExamScores.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<ExamScore>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedExamScores,
      } as GridEvent<ExamScore[]>);
    }
  }

  onRowSelect({ data }: { data: ExamScore }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: data,
    } as GridEvent<ExamScore>);
  }

  onRowUnselect({ data }: { data: ExamScore }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: data,
    } as GridEvent<ExamScore>);
  }

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
