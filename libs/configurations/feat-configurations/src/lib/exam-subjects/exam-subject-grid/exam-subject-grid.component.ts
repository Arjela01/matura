import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TableModule,
  TableRowSelectEvent,
  TableRowUnSelectEvent,
} from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';
import { ExamSubject } from '@msh/shared/domain-models';
import {
  ColumnFilterDirective,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';

@Component({
  selector: 'msh-exam-subject-grid',
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
  templateUrl: './exam-subject-grid.component.html',
  styleUrls: ['./exam-subject-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamSubjectGridComponent {
  @Input() examSubjects: ExamSubject[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  //Keep it local state because of Table Header checkbox not syncing
  selectedExamSubjects: ExamSubject[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<ExamSubject | ExamSubject[]>
  >();

  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();

  onEditClick(examSubject: ExamSubject) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: examSubject,
    } as GridEvent<ExamSubject>);
  }

  onDeleteClick(examSubject: ExamSubject) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: examSubject,
    } as GridEvent<ExamSubject>);
  }

  onSelectAllClick() {
    if (this.selectedExamSubjects.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<ExamSubject>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedExamSubjects,
      } as GridEvent<ExamSubject[]>);
    }
  }

  onRowSelect($event: TableRowSelectEvent) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: $event.data,
    } as GridEvent<ExamSubject>);
  }

  onRowUnselect($event: TableRowUnSelectEvent) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: $event.data,
    } as GridEvent<ExamSubject>);
  }

  loadRows($event: TableLazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
