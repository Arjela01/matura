import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { HighSchool } from '@msh/shared/domain-models';
import { GridEvent, GRID_ACTIONS } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'msh-high-school-grid',
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
  templateUrl: './high-school-grid.component.html',
  styleUrls: ['./high-school-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HighSchoolGridComponent {
  @Input() highSchools: HighSchool[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  //Keep it local state because of Table Header checkbox not syncing
  selectedHighSchools: HighSchool[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<HighSchool | HighSchool[]>
  >();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  onEditClick(highSchool: HighSchool) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: highSchool,
    } as GridEvent<HighSchool>);
  }

  onDeleteClick(highSchool: HighSchool) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: highSchool,
    } as GridEvent<HighSchool>);
  }

  onSelectAllClick() {
    if (this.selectedHighSchools.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<HighSchool>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedHighSchools,
      } as GridEvent<HighSchool[]>);
    }
  }

  onRowSelect({ data }: { data: HighSchool }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: data,
    } as GridEvent<HighSchool>);
  }

  onRowUnselect({ data }: { data: HighSchool }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: data,
    } as GridEvent<HighSchool>);
  }

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
