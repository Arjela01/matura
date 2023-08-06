import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FailingStudent } from '@msh/applications/domain-application';
import {
  ColumnFilterDirective,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'msh-manage-failing-students-grid',
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
  templateUrl: './manage-failing-students-grid.component.html',
  styleUrls: ['./manage-failing-students-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageFailingStudentsGridComponent {
  @Input() failingStudents: FailingStudent[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  @Output() gridEvent = new EventEmitter<
    GridEvent<FailingStudent | FailingStudent[]>
  >();

  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();

  onEditClick(failingStudent: FailingStudent) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: failingStudent,
    } as GridEvent<FailingStudent>);
  }

  onDeleteClick(failingStudent: FailingStudent) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: failingStudent,
    } as GridEvent<FailingStudent>);
  }

  loadRows($event: TableLazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
