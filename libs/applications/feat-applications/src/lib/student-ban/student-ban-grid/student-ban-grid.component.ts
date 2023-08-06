import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { StudentBan } from '@msh/shared/domain-models';
import {
  GridEvent,
  GRID_ACTIONS,
  ColumnFilterDirective,
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

@Component({
  selector: 'msh-student-ban-grid',
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
  templateUrl: './student-ban-grid.component.html',
  styleUrls: ['./student-ban-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentBanGridComponent {
  @Input() bannedStudents: StudentBan[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  //Keep it local state because of Table Header checkbox not syncing
  selectedBannedStudents: StudentBan[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<StudentBan | StudentBan[]>
  >();

  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();

  studentBan: StudentBan = {
    id: 0,
    studentId: '',
    studentIdentifier: '',
    studentInputData: '',
    studentName: '',
    description: '',
    isBanned: 0,
    effectiveDate: new Date(),
    banRemovalDate: new Date(),
  };

  onEditClick(studentBan: StudentBan) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: studentBan,
    } as GridEvent<StudentBan>);
  }

  onDeleteClick(StudentBan: StudentBan) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: StudentBan,
    } as GridEvent<StudentBan>);
  }

  onSelectAllClick() {
    if (this.selectedBannedStudents.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<StudentBan>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedBannedStudents,
      } as GridEvent<StudentBan[]>);
    }
  }

  onRowSelect($event: TableRowSelectEvent) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: $event.data,
    } as GridEvent<StudentBan>);
  }

  onRowUnselect($event: TableRowUnSelectEvent) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: $event.data,
    } as GridEvent<StudentBan>);
  }

  loadRows($event: TableLazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
