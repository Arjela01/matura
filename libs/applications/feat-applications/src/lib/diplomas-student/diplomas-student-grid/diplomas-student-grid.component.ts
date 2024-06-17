import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Student } from '@msh/shared/domain-models';
import {
  ColumnFilterDirective,
  DateFilterService,
  GRID_ACTIONS,
  GridEvent,
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
import { AppBoolPipe, AppDatePipe } from '@msh/shared/ui-shared';

@Component({
  selector: 'msh-diplomas-student-grid',
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
    DatePipe,
    AppDatePipe,
    AppBoolPipe,
  ],
  templateUrl: './diplomas-student-grid.component.html',
  styleUrls: ['./diplomas-student-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
})
export class DiplomasStudentGridComponent {
  @Input() students: Student[] = [];

  @Input() totalRecords = 0;
  @Input() loading = false;

  //Keep it local state because of Table Header checkbox not syncing
  selectedStudents: Student[] = [];
  @Input() responseLoaded: any;

  @Output() gridEvent = new EventEmitter<GridEvent<Student>>();

  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();
  constructor(private dateFilterService: DateFilterService) {}

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

  onRowSelect($event: TableRowSelectEvent) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: $event.data,
    } as GridEvent<Student>);
  }

  onPrint(data: Student) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.PRINT,
      data: data,
    } as GridEvent<Student>);
  }
  onSeal(data: Student) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SEAL,
      data: data,
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
}
