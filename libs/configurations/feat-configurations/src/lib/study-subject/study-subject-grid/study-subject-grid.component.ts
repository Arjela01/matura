import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { StudySubject } from '@msh/shared/domain-models';
import {
  ColumnFilterDirective,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import {TableLazyLoadEvent, TableRowSelectEvent, TableRowUnSelectEvent} from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'msh-study-subject-grid',
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
  templateUrl: './study-subject-grid.component.html',
  styleUrls: ['./study-subject-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudySubjectGridComponent {
  @Input() studySubjects: StudySubject[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  selectedStudySubjects: StudySubject[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<StudySubject | StudySubject[]>
  >();

  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();

  onEditClick(studySubject: StudySubject) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: studySubject,
    } as GridEvent<StudySubject>);
  }

  onDeleteClick(studySubject: StudySubject) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: studySubject,
    } as GridEvent<StudySubject>);
  }

  onSelectAllClick() {
    if (this.selectedStudySubjects.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<StudySubject>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedStudySubjects,
      } as GridEvent<StudySubject[]>);
    }
  }

  onRowSelect($event: TableRowSelectEvent) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: $event.data,
    } as GridEvent<StudySubject>);
  }

  onRowUnselect($event: TableRowUnSelectEvent) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: $event.data,
    } as GridEvent<StudySubject>);
  }

  loadRows($event: TableLazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
