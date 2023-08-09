import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { GRID_ACTIONS, GridEvent } from '@msh/shared/util-shared';
import {
  TableLazyLoadEvent,
  TableRowSelectEvent,
  TableRowUnSelectEvent,
} from 'primeng/table';
import { SharedStudent } from '../models/shared-student';

@Component({
  selector: 'msh-shared-student-lookup',
  templateUrl: './shared-student-lookup.component.html',
  styleUrls: ['./shared-student-lookup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedStudentLookupComponent {
  @Input() students: SharedStudent[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  @Output() gridEvent = new EventEmitter<
    GridEvent<SharedStudent | SharedStudent[]>
  >();

  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();

  onRowSelect($event: TableRowSelectEvent) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: $event.data,
    } as GridEvent<SharedStudent>);
  }

  onRowUnselect($event: TableRowUnSelectEvent) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: $event.data,
    } as GridEvent<SharedStudent>);
  }

  loadRows($event: TableLazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }

  onStudentSelect(student: SharedStudent) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: student,
    } as GridEvent<SharedStudent>);
  }
}
