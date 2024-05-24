import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ExamVariant } from '@msh/shared/domain-models';
import {
  ColumnFilterDirective,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'msh-exam-variant-grid',
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
  templateUrl: './exam-variant-grid.component.html',
  styleUrls: ['./exam-variant-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamVariantGridComponent {
  @Input() examVariants: ExamVariant[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  selectedExamVariants: ExamVariant[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<ExamVariant | ExamVariant[]>
  >();

  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();

  onEditClick(examVariant: ExamVariant) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: examVariant,
    } as GridEvent<ExamVariant>);
  }

  onAddQuestionClick(examVariant: ExamVariant) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.ADD,
      data: examVariant,
    } as GridEvent<ExamVariant>);
  }

  onDeleteClick(examVariant: ExamVariant) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: examVariant,
    } as GridEvent<ExamVariant>);
  }

  loadRows($event: TableLazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
