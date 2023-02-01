import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Student } from '@msh/configurations/domain-configurations';
import { GRID_ACTIONS, GridEvent } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'msh-a1z-student-search',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
    RippleModule,
  ],
  templateUrl: './a1z-student-search.component.html',
  styleUrls: ['./a1z-student-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class A1zStudentSearchComponent {
  @Input() students: Student[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  @Output() gridEvent = new EventEmitter<GridEvent<Student | Student[]>>();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

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

  onStudentSelect(student: Student) {
    console.log(student);
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: student,
    } as GridEvent<Student>);
  }
}
