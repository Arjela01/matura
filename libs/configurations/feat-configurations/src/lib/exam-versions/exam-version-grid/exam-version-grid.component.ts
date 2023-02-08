import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamVersion } from '@msh/shared/domain-models';
import { GRID_ACTIONS, GridEvent } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'msh-exam-version-grid',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
    RippleModule,
  ],
  templateUrl: './exam-version-grid.component.html',
  styleUrls: ['./exam-version-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamVersionGridComponent {
  @Input() examVersions: ExamVersion[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  selectedExamVersions: ExamVersion[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<ExamVersion | ExamVersion[]>
  >();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  onEditClick(examVersion: ExamVersion) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: examVersion,
    } as GridEvent<ExamVersion>);
  }

  onDeleteClick(examVersion: ExamVersion) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: examVersion,
    } as GridEvent<ExamVersion>);
  }

  onSelectAllClick() {
    if (this.selectedExamVersions.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<ExamVersion>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedExamVersions,
      } as GridEvent<ExamVersion[]>);
    }
  }

  onRowSelect({ data }: { data: ExamVersion }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: data,
    } as GridEvent<ExamVersion>);
  }

  onRowUnselect({ data }: { data: ExamVersion }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: data,
    } as GridEvent<ExamVersion>);
  }

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
