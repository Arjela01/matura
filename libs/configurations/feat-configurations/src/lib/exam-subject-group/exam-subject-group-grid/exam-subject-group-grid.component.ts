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
import { ExamSubjectGroup } from '@msh/shared/domain-models';
import {
  ColumnFilterDirective,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';

@Component({
  selector: 'msh-exam-subject-group-grid',
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
  templateUrl: './exam-subject-group-grid.component.html',
  styleUrls: ['./exam-subject-group-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamSubjectGroupGridComponent {
  @Input() examSubjectGroup: ExamSubjectGroup[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  @Output() gridEvent = new EventEmitter<
    GridEvent<ExamSubjectGroup | ExamSubjectGroup[]>
  >();
  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();

  onEditClick(examSubjectGroup: ExamSubjectGroup) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: examSubjectGroup,
    } as GridEvent<ExamSubjectGroup>);
  }

  onDeleteClick(examSubjectGroup: ExamSubjectGroup) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: examSubjectGroup,
    } as GridEvent<ExamSubjectGroup>);
  }

  loadRows($event: TableLazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
