import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManualExamGradeModel } from '@msh/shared/domain-models';
import {
  ColumnFilterDirective,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { SharedModule } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ExamGradeRequestFormComponent } from '../../exam-grade-request/exam-grade-request-form/exam-grade-request-form.component';
import { ExamGradeRequestGridComponent } from '../../exam-grade-request/exam-grade-request-grid/exam-grade-request-grid.component';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'msh-manual-exam-grade-grid',
  standalone: true,
  imports: [
    CommonModule,
    ColumnFilterDirective,
    SharedModule,
    TableModule,
    TooltipModule,
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
    ExamGradeRequestFormComponent,
    ExamGradeRequestGridComponent,
    RippleModule,
  ],
  templateUrl: './manual-exam-grade-grid.component.html',
  styleUrls: ['./manual-exam-grade-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManualExamGradeGridComponent {
  @Input() manualExamGrade: ManualExamGradeModel[] = [];
  @Input() totalRecords = 0;
  @Output() gridEvent = new EventEmitter<
    GridEvent<ManualExamGradeModel | ManualExamGradeModel[]>
  >();

  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();

  onEditClick(manualExamGrade: ManualExamGradeModel) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: manualExamGrade,
    } as GridEvent<ManualExamGradeModel>);
  }

  onDeleteClick(manualExamGrade: ManualExamGradeModel) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: manualExamGrade,
    } as GridEvent<ManualExamGradeModel>);
  }

  loadRows($event: TableLazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
