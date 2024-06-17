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
import {
  ColumnFilterDirective,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { ExamType } from '@msh/shared/domain-models';
import { RippleModule } from 'primeng/ripple';
import { TableLazyLoadEvent } from 'primeng/table';
import { AppBoolPipe } from '@msh/shared/ui-shared';

@Component({
  selector: 'msh-exam-type-grid',
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
    AppBoolPipe,
  ],
  templateUrl: './exam-type-grid.component.html',
  styleUrls: ['./exam-type-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamTypeGridComponent {
  @Input() examTypes: ExamType[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  //Keep it local state because of Table Header checkbox not syncing
  selectedExamTypes: ExamType[] = [];

  @Output() gridEvent = new EventEmitter<GridEvent<ExamType | ExamType[]>>();
  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();

  onEditClick(examType: ExamType) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: examType,
    } as GridEvent<ExamType>);
  }

  onDeleteClick(examType: ExamType) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: examType,
    } as GridEvent<ExamType>);
  }

  onSelectAllClick() {
    if (this.selectedExamTypes.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<ExamType>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedExamTypes,
      } as GridEvent<ExamType[]>);
    }
  }

  onRowSelect($event: TableRowSelectEvent) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: $event.data,
    } as GridEvent<ExamType>);
  }

  onRowUnselect($event: TableRowUnSelectEvent) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: $event.data,
    } as GridEvent<ExamType>);
  }

  loadRows($event: TableLazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
