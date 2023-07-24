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
import { ExamSubject } from '@msh/shared/domain-models';
import {
  ColumnFilterDirective,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';

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

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

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

  onRowSelect({ data }: { data: ExamSubject }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: data,
    } as GridEvent<ExamSubject>);
  }

  onRowUnselect({ data }: { data: ExamSubject }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: data,
    } as GridEvent<ExamSubject>);
  }

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
