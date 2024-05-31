import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamQuestionModel } from '@msh/shared/domain-models';
import {
  ColumnFilterDirective,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { SharedModule } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'msh-exam-question-grid',
  standalone: true,
  imports: [
    CommonModule,
    ColumnFilterDirective,
    SharedModule,
    TableModule,
    TooltipModule,
    ButtonModule,
    RippleModule,
  ],
  templateUrl: './student-list-publications-grid.component.html',
  styleUrls: ['./student-list-publications-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentListPublicationsGridComponent {
  @Input() examQuestions: ExamQuestionModel[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  @Output() gridEvent = new EventEmitter<
    GridEvent<ExamQuestionModel | ExamQuestionModel[]>
  >();
  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();

  onEditClick(examQuestion: ExamQuestionModel) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: examQuestion,
    } as GridEvent<ExamQuestionModel>);
  }

  onDeleteClick(examQuestion: ExamQuestionModel) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: examQuestion,
    } as GridEvent<ExamQuestionModel>);
  }

  loadRows($event: TableLazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
