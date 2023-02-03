import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { GRID_ACTIONS, GridEvent } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
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

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  onRowSelect({ data }: { data: SharedStudent }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: data,
    } as GridEvent<SharedStudent>);
  }

  onRowUnselect({ data }: { data: SharedStudent }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: data,
    } as GridEvent<SharedStudent>);
  }

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }

  onStudentSelect(student: SharedStudent) {
    console.log(student);
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: student,
    } as GridEvent<SharedStudent>);
  }
}
