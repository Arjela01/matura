import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { StudyProgram } from '@msh/configurations/domain-configurations';
import { GRID_ACTIONS, GridEvent } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
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

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

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

  onRowSelect({ data }: { data: StudyProgram }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: data,
    } as GridEvent<StudyProgram>);
  }

  onRowUnselect({ data }: { data: StudyProgram }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: data,
    } as GridEvent<StudyProgram>);
  }

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
