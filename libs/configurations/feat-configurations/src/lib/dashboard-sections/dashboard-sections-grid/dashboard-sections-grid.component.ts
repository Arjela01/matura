import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {GridEvent, GRID_ACTIONS, ColumnFilterDirective} from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import {DashboardSection} from "@msh/shared/domain-models";

@Component({
  selector: 'msh-dashboard-sections-grid',
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
  templateUrl: './dashboard-sections-grid.component.html',
  styleUrls: ['./dashboard-sections-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardSectionsGridComponent {
  @Input() dashboardSection: DashboardSection[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  //Keep it local state because of Table Header checkbox not syncing
  selectedDashboardSections: DashboardSection[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<DashboardSection | DashboardSection[]>
  >();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  onEditClick(dashboardSection: DashboardSection) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: dashboardSection,
    } as GridEvent<DashboardSection>);
  }

  onDeleteClick(dashboardSection: DashboardSection) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: dashboardSection,
    } as GridEvent<DashboardSection>);
  }

  onSelectAllClick() {
    if (this.selectedDashboardSections.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<DashboardSection>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedDashboardSections,
      } as GridEvent<DashboardSection[]>);
    }
  }

  onRowSelect({ data }: { data: DashboardSection }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: data,
    } as GridEvent<DashboardSection>);
  }

  onRowUnselect({ data }: { data: DashboardSection }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: data,
    } as GridEvent<DashboardSection>);
  }

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
