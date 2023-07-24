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
import { LazyLoadEvent } from 'primeng/api';
import { ExamSecret } from '@msh/evaluations/domain-evaluations';

@Component({
  selector: 'msh-exam-secret-grid',
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
  templateUrl: './exam-secrets-grid.component.html',
  styleUrls: ['./exam-secrets-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamSecretsGridComponent {
  @Input() examSecrets: ExamSecret[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  //Keep it local state because of Table Header checkbox not syncing
  selectedExamSecrets: ExamSecret[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<ExamSecret | ExamSecret[]>
  >();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  onEditClick(examScore: ExamSecret) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: examScore,
    } as GridEvent<ExamSecret>);
  }

  onDeleteClick(examScore: ExamSecret) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: examScore,
    } as GridEvent<ExamSecret>);
  }

  onSelectAllClick() {
    if (this.selectedExamSecrets.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<ExamSecret>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedExamSecrets,
      } as GridEvent<ExamSecret[]>);
    }
  }

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
