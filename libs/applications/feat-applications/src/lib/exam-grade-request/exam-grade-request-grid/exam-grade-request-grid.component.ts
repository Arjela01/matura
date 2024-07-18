import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ExamGradeRequestModel } from '@msh/shared/domain-models';
import { AppBoolPipe, AppDatePipe, AppTimePipe } from '@msh/shared/ui-shared';
import {
  ColumnFilterDirective,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { UntilDestroy } from '@ngneat/until-destroy';
import { SharedModule } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { StudentsHistoryGridComponent } from '../../students/students-history/students-history-grid.component';
import { ExamGradeRequestHistoryGridComponent } from '../exam-grade-request-history/exam-grade-request-history-grid.component';

@UntilDestroy()
@Component({
  selector: 'msh-exam-grade-request-grid',
  standalone: true,
  imports: [
    CommonModule,
    ColumnFilterDirective,
    SharedModule,
    TableModule,
    TooltipModule,
    RouterLink,
    DialogModule,
    StudentsHistoryGridComponent,
    ExamGradeRequestHistoryGridComponent,
    DatePipe,
    AppDatePipe,
    AppBoolPipe,
    AppTimePipe
  ],
  providers: [DatePipe],
  templateUrl: './exam-grade-request-grid.component.html',
  styleUrls: ['./exam-grade-request-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamGradeRequestGridComponent {
  @Input() studentId: any;
  @Input() headerText = '';
  @Input() displayHistoryForm = true;
  @Input() selectedRecord: any;
  @Input() examGradeRequest: ExamGradeRequestModel[] = [];
  @Input() totalRecords = 0;
  @Output() gridEvent = new EventEmitter<
    GridEvent<ExamGradeRequestModel | ExamGradeRequestModel[]>
  >();

  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();

  onEditClick(examGradeRequest: ExamGradeRequestModel) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: examGradeRequest,
    } as GridEvent<ExamGradeRequestModel>);
  }
  onHistoryClick(examGradeRequest: ExamGradeRequestModel) {
    this.displayHistoryForm = true;
    this.gridEvent.emit({
      action: GRID_ACTIONS.HISTORY,
      data: examGradeRequest,
    } as GridEvent<ExamGradeRequestModel>);
  }

  onDeleteClick(examGradeRequest: ExamGradeRequestModel) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: examGradeRequest,
    } as GridEvent<ExamGradeRequestModel>);
  }

  loadRows($event: TableLazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
