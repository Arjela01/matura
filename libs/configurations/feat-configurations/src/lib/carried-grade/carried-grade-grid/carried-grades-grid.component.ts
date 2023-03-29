import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { EventEmitter, Input, Output } from '@angular/core';
import { CarriedGrade } from '@msh/applications/domain-application';
import { GridEvent, GRID_ACTIONS } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
@Component({
  selector: 'msh-carried-grades-grid',
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
  templateUrl: './carried-grades-grid.component.html',
  styleUrls: ['./carried-grades-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarriedGradesGridComponent {
  @Input() carriedGrades: CarriedGrade[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  //Keep it local state because of Table Header checkbox not syncing
  selectedGrades: CarriedGrade[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<CarriedGrade | CarriedGrade[]>
  >();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  onEditClick(carriedGrade: CarriedGrade) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: carriedGrade,
    } as GridEvent<CarriedGrade>);
  }

  onDeleteClick(carriedGrade: CarriedGrade) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: carriedGrade,
    } as GridEvent<CarriedGrade>);
  }

  onDownloadClick(carriedGrade: CarriedGrade) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.CUSTOM_ACTION2,
      data: carriedGrade,
    } as GridEvent<CarriedGrade>);
  }

  onSelectAllClick() {
    if (this.selectedGrades.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<CarriedGrade>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedGrades,
      } as GridEvent<CarriedGrade[]>);
    }
  }

  onRowSelect({ data }: { data: CarriedGrade }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: data,
    } as GridEvent<CarriedGrade>);
  }

  onRowUnselect({ data }: { data: CarriedGrade }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: data,
    } as GridEvent<CarriedGrade>);
  }

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
