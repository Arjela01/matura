import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { A1ZTableRecord } from '@msh/applications/domain-application';
import {
  ColumnFilterDirective, DateFilterService,
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
import { RouterLink } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import {A1zHistoryGridComponent} from "../a1z-history/a1z-history-grid.component";

@Component({
  selector: 'msh-a1z-grid',
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
    RouterLink,
    A1zHistoryGridComponent,
    DialogModule,
  ],
  templateUrl: './a1z-grid.component.html',
  styleUrls: ['./a1z-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class A1zGridComponent {
  @Input() a1z: A1ZTableRecord[] = [];
  @Input() totalRecords = 0;
  @Input() studentId: any;
  @Input() headerText = '';
  @Input() displayHistoryForm = true;
  @Input() selectedRecord: any;
  selectedA1Z: A1ZTableRecord[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<A1ZTableRecord | A1ZTableRecord[]>
  >();

  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();
  constructor(private dateFilterService: DateFilterService) {}

  onEditClick(A1Z: A1ZTableRecord) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: A1Z,
    } as GridEvent<A1ZTableRecord>);
  }

  onDeleteClick(A1Z: A1ZTableRecord) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: A1Z,
    } as GridEvent<A1ZTableRecord>);
  }
  onHistoryClick(A1Z: A1ZTableRecord) {
    this.displayHistoryForm = true;
    this.gridEvent.emit({
      action: GRID_ACTIONS.HISTORY,
      data: A1Z,
    } as GridEvent<A1ZTableRecord>);
  }

  onSelectAllClick() {
    if (this.selectedA1Z.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<A1ZTableRecord>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedA1Z,
      } as GridEvent<A1ZTableRecord[]>);
    }
  }

  onRowSelect($event: TableRowSelectEvent) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: $event.data,
    } as GridEvent<A1ZTableRecord>);
  }

  onRowUnselect($event: TableRowUnSelectEvent) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: $event.data,
    } as GridEvent<A1ZTableRecord>);
  }

  loadRows($event: TableLazyLoadEvent) {
    const filters = $event.filters as any;
    $event.filters = this.dateFilterService.applyDateManipulation(filters);
    this.lazyLoadData.emit($event);
  }
}
