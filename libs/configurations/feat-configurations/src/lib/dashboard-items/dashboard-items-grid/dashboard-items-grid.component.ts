import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { GridEvent, GRID_ACTIONS } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import {DashboardItems} from "@msh/shared/domain-models";

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
  ],
  templateUrl: './dashboard-items-grid.component.html',
  styleUrls: ['./dashboard-items-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardItemsGridComponent {
  @Input() dashboardItems: DashboardItems[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  //Keep it local state because of Table Header checkbox not syncing
  selectedDashboardItems: DashboardItems[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<DashboardItems | DashboardItems[]>
  >();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  dashboardItem: DashboardItems = {
    name:'',
    roles: [],
  };

  onEditClick(dashboardItems: DashboardItems) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: dashboardItems,
    } as GridEvent<DashboardItems>);
  }

  onDeleteClick(dashboardItems: DashboardItems) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: dashboardItems,
    } as GridEvent<DashboardItems>);
  }

  onSelectAllClick() {
    if (this.selectedDashboardItems.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<DashboardItems>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedDashboardItems,
      } as GridEvent<DashboardItems[]>);
    }
  }

  onRowSelect({ data }: { data: DashboardItems }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: data,
    } as GridEvent<DashboardItems>);
  }

  onRowUnselect({ data }: { data: DashboardItems }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: data,
    } as GridEvent<DashboardItems>);
  }

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
