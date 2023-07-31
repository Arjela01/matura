import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import {
  GlobalToastService,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import {
  ExamScore,
  ExamScoreDataEntry,
  ExamScores,
} from '@msh/evaluations/domain-evaluations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ExamScoreApiService } from '@msh/evaluations/data-access-evaluations';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { LazyLoadEvent } from 'primeng/api';

@UntilDestroy()
@Component({
  selector: 'msh-exam-score-view-table',
  standalone: true,
  imports: [
    CommonModule,
    DropdownModule,
    TableModule,
    PaginatorModule,
    InputTextModule,
    ButtonModule,
  ],
  templateUrl: './exam-score-view-table.component.html',
  styleUrls: ['./exam-score-view-table.component.scss'],
})
export class ExamScoreViewTableComponent {
  @Input() examScoreLists: ExamScoreDataEntry[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  @Output() gridEvent = new EventEmitter<
    GridEvent<ExamScores | ExamScores[]>
  >();

  @Output() writingScoreChange = new EventEmitter<any>();
  filters: LazyLoadEvent | null = null;

  event = {
    first: 0,
    rows: 10000,
    sortOrder: 1,
    filters: {},
    globalFilter: null,
  };

  onDeleteClick(examScores: ExamScores) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: examScores,
    } as GridEvent<ExamScores>);
  }
  onExamScoreAddOrUpdate(examScores: any) {
    this.writingScoreChange.emit(examScores);
  }
}
