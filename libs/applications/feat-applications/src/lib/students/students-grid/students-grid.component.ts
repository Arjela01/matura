import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  GridEvent,
  GRID_ACTIONS,
  ColumnFilterDirective,
  DateFilterService,
} from '@msh/shared/util-shared';
import {
  TableLazyLoadEvent,
  TableRowSelectEvent,
  TableRowUnSelectEvent,
} from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { Student } from '@msh/shared/domain-models';
import { RouterLink } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { StudentsHistoryGridComponent } from '../students-history/students-history-grid.component';
import { PermissionEnum } from '@msh/auth/data-access-auth';
import {AppDatePipe} from "@msh/shared/ui-shared";

@Component({
  selector: 'msh-students-grid',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
    RippleModule,
    RouterLink,
    ColumnFilterDirective,
    StudentsHistoryGridComponent,
    DialogModule,
    AppDatePipe,
  ],
  templateUrl: './students-grid.component.html',
  styleUrls: ['./students-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentsGridComponent {
  @Input() students: Student[] = [];
  @Input() studentId: any;
  @Input() headerText = '';
  @Input() displayHistoryForm = true;
  @Input() selectedRecord: any;
  @Input() totalRecords = 0;
  @Input() loading = false;
  @Input() showEditButton = false;
  @Input() showDeleteButton = false;

  //Keep it local state because of Table Header checkbox not syncing
  selectedStudents: Student[] = [];

  @Output() gridEvent = new EventEmitter<GridEvent<Student | Student[]>>();

  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();

  student: Student[] = [];
  constructor(private dateFilterService: DateFilterService) {}

  onHistoryClick(student: Student) {
    this.displayHistoryForm = true;
    this.gridEvent.emit({
      action: GRID_ACTIONS.HISTORY,
      data: student,
    } as GridEvent<Student>);
  }

  onDeleteClick(student: Student) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: student,
    } as GridEvent<Student>);
  }

  onSelectAllClick() {
    if (this.selectedStudents.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<Student>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedStudents,
      } as GridEvent<Student[]>);
    }
  }

  onRowSelect($event: TableRowSelectEvent) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: $event.data,
    } as GridEvent<Student>);
  }

  onRowUnselect($event: TableRowUnSelectEvent) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: $event.data,
    } as GridEvent<Student>);
  }

  loadRows($event: TableLazyLoadEvent) {
    const filters = $event.filters as any;
    $event.filters = this.dateFilterService.applyDateManipulation(filters);
    this.lazyLoadData.emit($event);
  }
  protected readonly PermissionEnum = PermissionEnum;
}
