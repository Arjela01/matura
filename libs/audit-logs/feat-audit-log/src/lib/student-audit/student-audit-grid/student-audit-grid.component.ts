import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  ColumnFilterDirective,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { DialogModule } from 'primeng/dialog';
import { SharedModule } from 'primeng/api';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { UntilDestroy } from '@ngneat/until-destroy';
import { RouterLink } from '@angular/router';
import { AppBoolPipe, AppDatePipe } from '@msh/shared/ui-shared';
import { BarcodeCorrection, Student } from '@msh/shared/domain-models';

@UntilDestroy()
@Component({
  selector: 'msh-student-audit-grid',
  standalone: true,
  imports: [
    CommonModule,
    ColumnFilterDirective,
    DialogModule,
    SharedModule,
    TableModule,
    TooltipModule,
    RouterLink,
    DatePipe,
    AppDatePipe,
    AppBoolPipe,
  ],
  templateUrl: './student-audit-grid.component.html',
  styleUrls: ['./student-audit-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
})
export class StudentAuditGridComponent {
  @Input() students: Student[] = [];
  @Input() totalRecords = 0;

  @Output() gridEvent = new EventEmitter<GridEvent<Student | Student[]>>();
  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();

  onEditClick(student: Student) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: student,
    } as GridEvent<Student>);
  }

  loadRows($event: TableLazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
