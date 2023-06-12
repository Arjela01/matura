import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ExamAssignment } from '@msh/shared/domain-models';
import {GridEvent, GRID_ACTIONS, ColumnFilterDirective} from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'msh-exam-assignment-grid',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
    RippleModule,
    RouterLink,
    ColumnFilterDirective
  ],
  templateUrl: './exam-assignment-grid.component.html',
  styleUrls: ['./exam-assignment-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamAssignmentGridComponent {
  @Input() examAssignments: ExamAssignment[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  //Keep it local state because of Table Header checkbox not syncing
  selectedExamAssignments: ExamAssignment[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<ExamAssignment | ExamAssignment[]>
  >();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  examAssignment: ExamAssignment = {
    id: '',
    studentIdentifier: '',
    studentId: '',
    studentName: '',
    studentInputData: '',
    date: new Date(),
    examDateId: 0,
    examSiteId: '',
    examSiteName: '',
    time: '',
  };

  onDeleteClick(examAssignment: ExamAssignment) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: examAssignment,
    } as GridEvent<ExamAssignment>);
  }

  onRowSelect({ data }: { data: ExamAssignment }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: data,
    } as GridEvent<ExamAssignment>);
  }

  onRowUnselect({ data }: { data: ExamAssignment }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: data,
    } as GridEvent<ExamAssignment>);
  }

  onEditClick(examAssignment: ExamAssignment) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: examAssignment,
    } as GridEvent<ExamAssignment>);
  }

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
