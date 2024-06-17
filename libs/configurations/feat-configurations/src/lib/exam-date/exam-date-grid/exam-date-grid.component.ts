import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ExamDate } from '@msh/shared/domain-models';
import {
  ColumnFilterDirective,
  DateFilterService,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import {
  TableLazyLoadEvent,
  TableModule,
  TableRowSelectEvent,
  TableRowUnSelectEvent,
} from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { AppBoolPipe, AppDatePipe } from '@msh/shared/ui-shared';

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
    ColumnFilterDirective,
    DatePipe,
    AppDatePipe,
    AppBoolPipe,
  ],
  templateUrl: './exam-date-grid.component.html',
  styleUrls: ['./exam-date-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
})
export class ExamDateGridComponent {
  @Input() examDates: ExamDate[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  //Keep it local state because of Table Header checkbox not syncing
  selectedExamDates: ExamDate[] = [];
  @Output() gridEvent = new EventEmitter<GridEvent<ExamDate | ExamDate[]>>();

  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();

  constructor(private dateFilterService: DateFilterService) {}

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

  onRowSelect($event: TableRowSelectEvent) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: $event.data,
    } as GridEvent<ExamDate>);
  }

  onRowUnselect($event: TableRowUnSelectEvent) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: $event.data,
    } as GridEvent<ExamDate>);
  }

  loadRows($event: TableLazyLoadEvent) {
    const filters = $event.filters as any;
    $event.filters = this.dateFilterService.applyDateManipulation(filters);
    this.lazyLoadData.emit($event);
  }
}
