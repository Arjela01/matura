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
  ExamScoreDataEntry,
  ExamScores,
} from '@msh/evaluations/domain-evaluations';
import { UntilDestroy } from '@ngneat/until-destroy';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { LazyLoadEvent } from 'primeng/api';

@UntilDestroy()
@Component({
  selector: 'msh-exam-score-tabular-data-entry-list',
  standalone: true,
  imports: [
    CommonModule,
    DropdownModule,
    TableModule,
    PaginatorModule,
    InputTextModule,
    ButtonModule,
  ],
  templateUrl: './exam-score-tabular-data-entry-list.component.html',
  styleUrls: ['./exam-score-tabular-data-entry-list.component.scss'],
})
export class ExamScoreTabularDataEntryListComponent {
  @Input() examScoreLists: ExamScoreDataEntry[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  @Input() examSubjectName: any;
  @Input() examTypeName: any;
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
