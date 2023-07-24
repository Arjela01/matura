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
} from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { Student } from '@msh/shared/domain-models';
import { RouterLink } from '@angular/router';

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
  ],
  templateUrl: './students-grid.component.html',
  styleUrls: ['./students-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentsGridComponent {
  @Input() students: Student[] = [];

  @Input() totalRecords = 0;
  @Input() loading = false;

  //Keep it local state because of Table Header checkbox not syncing
  selectedStudents: Student[] = [];

  @Output() gridEvent = new EventEmitter<GridEvent<Student | Student[]>>();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  student: Student[] = [];
  // onEditClick(student: Student) {
  //   this.gridEvent.emit({
  //     action: GRID_ACTIONS.EDIT,
  //     data: student,
  //   } as GridEvent<Student>);
  // }

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

  onRowSelect({ data }: { data: Student }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: data,
    } as GridEvent<Student>);
  }

  onRowUnselect({ data }: { data: Student }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: data,
    } as GridEvent<Student>);
  }

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
