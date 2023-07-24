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
import { ExamSubjectProfile } from '@msh/shared/domain-models';
import {
  ColumnFilterDirective,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'msh-exam-subject-profile-grid',
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
  templateUrl: './exam-subject-profile-grid.component.html',
  styleUrls: ['./exam-subject-profile-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamSubjectProfileGridComponent {
  @Input() examSubjects: ExamSubjectProfile[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  //Keep it local state because of Table Header checkbox not syncing
  selectedExamSubjects: ExamSubjectProfile[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<ExamSubjectProfile | ExamSubjectProfile[]>
  >();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  onEditClick(examSubject: ExamSubjectProfile) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: examSubject,
    } as GridEvent<ExamSubjectProfile>);
  }

  onDeleteClick(examSubject: ExamSubjectProfile) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: examSubject,
    } as GridEvent<ExamSubjectProfile>);
  }

  onSelectAllClick() {
    if (this.selectedExamSubjects.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<ExamSubjectProfile>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedExamSubjects,
      } as GridEvent<ExamSubjectProfile[]>);
    }
  }

  onRowSelect({ data }: { data: ExamSubjectProfile }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: data,
    } as GridEvent<ExamSubjectProfile>);
  }

  onRowUnselect({ data }: { data: ExamSubjectProfile }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: data,
    } as GridEvent<ExamSubjectProfile>);
  }

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
