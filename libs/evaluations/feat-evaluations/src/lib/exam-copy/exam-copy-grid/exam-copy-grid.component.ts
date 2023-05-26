import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {ExamCopy, ExamCopyRequestStatusEnum} from '@msh/evaluations/domain-evaluations';
import { GRID_ACTIONS, GridEvent } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ExamCopyRequestStatusPipe } from './exam-copy-request-status-pipe';

@Component({
  selector: 'msh-exam-copy-grid',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
    RippleModule,
    ExamCopyRequestStatusPipe,
  ],
  templateUrl: './exam-copy-grid.component.html',
  styleUrls: ['./exam-copy-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamCopyGridComponent {
  @Input() examCopies: ExamCopy[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  @Output() gridEvent = new EventEmitter<GridEvent<ExamCopy | ExamCopy[]>>();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  onProceedClick(examCopy: ExamCopy) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: examCopy,
    } as GridEvent<ExamCopy>);
  }

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }

  ExamCopyRequestStatusEnum = ExamCopyRequestStatusEnum;
}
