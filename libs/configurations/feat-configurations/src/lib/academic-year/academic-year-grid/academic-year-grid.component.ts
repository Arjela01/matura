import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { AcademicYear } from '@msh/shared/domain-models';
import {GridEvent, GRID_ACTIONS, ColumnFilterDirective} from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'msh-academic-year-grid',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
    RippleModule,
    ColumnFilterDirective
  ],
  templateUrl: './academic-year-grid.component.html',
  styleUrls: ['./academic-year-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcademicYearGridComponent {
  @Input() academicYears: AcademicYear[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  //Keep it local state because of Table Header checkbox not syncing
  selectedAcademicYears: AcademicYear[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<AcademicYear | AcademicYear[]>
    >();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  onEditClick(academicYear: AcademicYear) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: academicYear,
    } as GridEvent<AcademicYear>);
  }

  onDeleteClick(academicYear: AcademicYear) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: academicYear,
    } as GridEvent<AcademicYear>);
  }

  onSelectAllClick() {
    if (this.selectedAcademicYears.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<AcademicYear>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedAcademicYears,
      } as GridEvent<AcademicYear[]>);
    }
  }

  onRowSelect({ data }: { data: AcademicYear }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: data,
    } as GridEvent<AcademicYear>);
  }

  onRowUnselect({ data }: { data: AcademicYear }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: data,
    } as GridEvent<AcademicYear>);
  }

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
