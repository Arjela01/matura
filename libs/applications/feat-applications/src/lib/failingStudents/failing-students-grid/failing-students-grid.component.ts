import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FailingStudent } from '@msh/applications/domain-application';
import { Student } from '@msh/shared/domain-models';
import {ColumnFilterDirective, GRID_ACTIONS, GridEvent} from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import {ChipModule} from "primeng/chip";

@Component({
  selector: 'msh-failing-students-grid',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
    RippleModule,
    ChipModule,
    ColumnFilterDirective
  ],
  templateUrl: './failing-students-grid.component.html',
  styleUrls: ['./failing-students-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FailingStudentsGridComponent {
  @Input() failingStudents: FailingStudent[] = [];
  @Input() students: Student[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  // selectedFailingStudent: Failin

  @Output() gridEvent = new EventEmitter<
    GridEvent<FailingStudent | FailingStudent[]>
  >();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  onEditClick(failingStudent: FailingStudent) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: failingStudent,
    } as GridEvent<FailingStudent>);
  }

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
