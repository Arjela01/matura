import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';
import {
  ColumnFilterDirective,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { ExamGradeChange } from '@msh/shared/domain-models';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'msh-exam-grade-changes-grid',
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
    DialogModule,
  ],
  templateUrl: './exam-grade-changes-grid.component.html',
  styleUrls: ['./exam-grade-changes-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamGradeChangesGridComponent {
  @Input() examGradeChanges: ExamGradeChange[] = [];
  @Input() totalRecords = 0;

  @Output() gridEvent = new EventEmitter<
    GridEvent<ExamGradeChange | ExamGradeChange[]>
  >();
  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();

  onEditClick(examGradeChanges: ExamGradeChange) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: examGradeChanges,
    } as GridEvent<ExamGradeChange>);
  }

  loadRows($event: TableLazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
