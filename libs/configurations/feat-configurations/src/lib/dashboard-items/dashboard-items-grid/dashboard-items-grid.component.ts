import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { DashboardItem } from '@msh/shared/domain-models';
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
  selector: 'msh-dashboard-items-grid',
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
  templateUrl: './dashboard-items-grid.component.html',
  styleUrls: ['./dashboard-items-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardItemsGridComponent {
  @Input() dashboardItems: DashboardItem[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  selectedDashboardItems: DashboardItem[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<DashboardItem | DashboardItem[]>
  >();

  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();

  onDownloadClick(dashboardItems: DashboardItem) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.CUSTOM_ACTION2,
      data: dashboardItems,
    } as GridEvent<DashboardItem>);
  }

  onEditClick(dashboardItems: DashboardItem) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: dashboardItems,
    } as GridEvent<DashboardItem>);
  }

  onDeleteClick(dashboardItems: DashboardItem) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: dashboardItems,
    } as GridEvent<DashboardItem>);
  }

  onSelectAllClick() {
    if (this.selectedDashboardItems.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<DashboardItem>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedDashboardItems,
      } as GridEvent<DashboardItem[]>);
    }
  }

  onRowSelect($event: TableRowSelectEvent) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: $event.data,
    } as GridEvent<DashboardItem>);
  }

  onRowUnselect($event: TableRowUnSelectEvent) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: $event.data,
    } as GridEvent<DashboardItem>);
  }

  loadRows($event: TableLazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
