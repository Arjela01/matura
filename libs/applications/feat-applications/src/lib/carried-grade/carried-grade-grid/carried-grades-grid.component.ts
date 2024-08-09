import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { EventEmitter, Input, Output } from '@angular/core';
import { CarriedGrade } from '@msh/applications/domain-application';
import {
  GridEvent,
  GRID_ACTIONS,
  ColumnFilterDirective,
  CARRIED_GRADE,
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
import { DialogModule } from 'primeng/dialog';
import { CarriedGradeHistoryComponent } from '../carried-grade-history/carried-grade-history.component';

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
    ColumnFilterDirective,
    DialogModule,
    CarriedGradeHistoryComponent,
  ],
  templateUrl: './carried-grades-grid.component.html',
  styleUrls: ['./carried-grades-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarriedGradesGridComponent {
  @Input() carriedGrades: CarriedGrade[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  @Input() studentId: any;
  @Input() headerText = '';
  @Input() displayHistoryForm = true;
  @Input() selectedRecord: any;

  //Keep it local state because of Table Header checkbox not syncing
  selectedGrades: CarriedGrade[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<CarriedGrade | CarriedGrade[]>
  >();

  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();

  onEditClick(carriedGrade: CarriedGrade) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: carriedGrade,
    } as GridEvent<CarriedGrade>);
  }

  onHistoryClick(carriedGrade: CarriedGrade) {
    this.displayHistoryForm = true;
    this.gridEvent.emit({
      action: GRID_ACTIONS.HISTORY,
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

  loadRows($event: TableLazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
