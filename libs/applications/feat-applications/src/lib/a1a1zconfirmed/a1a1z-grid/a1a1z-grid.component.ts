import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Student } from '@msh/shared/domain-models';
import {
  GridEvent,
  GRID_ACTIONS,
  ColumnFilterDirective,
  DateFilterService,
} from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { RouterLink } from '@angular/router';
import { AppBoolPipe, AppDatePipe } from '@msh/shared/ui-shared';

@Component({
  selector: 'a1a1z-grid',
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
    ColumnFilterDirective,
    RouterLink,
    DatePipe,
    AppDatePipe,
    AppBoolPipe,
  ],
  templateUrl: './a1a1z-grid.component.html',
  styleUrls: ['./a1a1z-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class A1a1zGridComponent {
  @Input() students: Student[] = [];

  @Input() totalRecords = 0;
  @Input() loading = false;

  @Output() gridEvent = new EventEmitter<GridEvent<Student | Student[]>>();

  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();
  constructor(private dateFilterService: DateFilterService) {}

  student: Student[] = [];
  // onEditClick(student: Student) {
  //   this.gridEvent.emit({
  //     action: GRID_ACTIONS.EDIT,
  //     data: student,
  //   } as GridEvent<Student>);
  // }

  onRefuse(student: Student) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.REJECT,
      data: student,
    } as GridEvent<Student>);
  }
  onApprove(student: Student) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.ACCEPT,
      data: student,
    } as GridEvent<Student>);
  }

  loadRows($event: TableLazyLoadEvent) {
    const filters = $event.filters as any;
    $event.filters = this.dateFilterService.applyDateManipulation(filters);
    this.lazyLoadData.emit($event);
  }
}
