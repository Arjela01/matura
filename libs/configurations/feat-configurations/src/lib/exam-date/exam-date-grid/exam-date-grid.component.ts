import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ExamDate } from '@msh/shared/domain-models';
import { GridEvent, GRID_ACTIONS } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'msh-exam-date-grid',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
    RippleModule,
  ],
  templateUrl: './exam-date-grid.component.html',
  styleUrls: ['./exam-date-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamDateGridComponent {
  @Input() examDates: ExamDate[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  //Keep it local state because of Table Header checkbox not syncing
  selectedExamDates: ExamDate[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<ExamDate | ExamDate[]>
    >();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  onEditClick(examDate: ExamDate) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: examDate,
    } as GridEvent<ExamDate>);
  }

  onDeleteClick(examDate: ExamDate) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: examDate,
    } as GridEvent<ExamDate>);
  }

  onSelectAllClick() {
    if (this.selectedExamDates.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<ExamDate>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedExamDates,
      } as GridEvent<ExamDate[]>);
    }
  }

  onRowSelect({ data }: { data: ExamDate }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: data,
    } as GridEvent<ExamDate>);
  }

  onRowUnselect({ data }: { data: ExamDate }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: data,
    } as GridEvent<ExamDate>);
  }

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
