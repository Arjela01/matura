import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {GridEvent, GRID_ACTIONS, ColumnFilterDirective} from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import {  Student } from '@msh/shared/domain-models';


@Component({
  selector: 'msh-diploma-requirement-exception-grid',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
    RippleModule,
    ColumnFilterDirective
  ],
  templateUrl: './diploma-requirement-exception-grid.component.html',
  styleUrls: ['./diploma-requirement-exception-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiplomaRequirementExceptionGridComponent {
  @Input() students: Student[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  @Output() gridEvent = new EventEmitter<GridEvent<Student | Student[]>>();
  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  student: Student[] = [];
  selectedStudents: Student[] = [];

  submitted = false;
  id: any;

  changeStatus(student: Student): void {
    this.gridEvent.emit({
      action: GRID_ACTIONS.CUSTOM_ACTION2,
      data: student,
    } as GridEvent<Student>);
  }

  onRowSelect({ data }: { data: Student }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: data.id,
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
