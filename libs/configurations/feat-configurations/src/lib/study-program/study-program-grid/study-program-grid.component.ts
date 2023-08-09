import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { StudyProgram } from '@msh/shared/domain-models';
import {
  ColumnFilterDirective,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import {
  TableLazyLoadEvent,
  TableRowSelectEvent,
  TableRowUnSelectEvent,
} from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'msh-study-program-grid',
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
  templateUrl: './study-program-grid.component.html',
  styleUrls: ['./study-program-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudyProgramGridComponent {
  @Input() studyPrograms: StudyProgram[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  //Keep it local state because of Table Header checkbox not syncing
  selectedStudyProgram: StudyProgram[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<StudyProgram | StudyProgram[]>
  >();

  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();

  onEditClick(studyProgram: StudyProgram) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: studyProgram,
    } as GridEvent<StudyProgram>);
  }

  onDeleteClick(studyProgram: StudyProgram) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: studyProgram,
    } as GridEvent<StudyProgram>);
  }

  onSelectAllClick() {
    if (this.selectedStudyProgram.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<StudyProgram>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedStudyProgram,
      } as GridEvent<StudyProgram[]>);
    }
  }

  onRowSelect($event: TableRowSelectEvent) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: $event.data,
    } as GridEvent<StudyProgram>);
  }

  onRowUnselect($event: TableRowUnSelectEvent) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: $event.data,
    } as GridEvent<StudyProgram>);
  }

  loadRows($event: TableLazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
