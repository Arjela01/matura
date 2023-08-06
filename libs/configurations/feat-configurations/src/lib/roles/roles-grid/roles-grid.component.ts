import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Role } from '@msh/shared/domain-models';
import {
  GridEvent,
  GRID_ACTIONS,
  ColumnFilterDirective,
} from '@msh/shared/util-shared';
import {TableLazyLoadEvent, TableRowSelectEvent, TableRowUnSelectEvent} from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
@Component({
  selector: 'msh-roles-grid',
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
  templateUrl: './roles-grid.component.html',
  styleUrls: ['./roles-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesGridComponent {
  @Input() roles: Role[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  //Keep it local state because of Table Header checkbox not syncing
  selectedRoles: Role[] = [];

  @Output() gridEvent = new EventEmitter<GridEvent<Role | Role[]>>();

  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();

  onEditClick(role: Role) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: role,
    } as GridEvent<Role>);
  }

  onDeleteClick(role: Role) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: role,
    } as GridEvent<Role>);
  }

  onSelectAllClick() {
    if (this.selectedRoles.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<Role>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedRoles,
      } as GridEvent<Role[]>);
    }
  }

  onRowSelect($event: TableRowSelectEvent) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: $event.data,
    } as GridEvent<Role>);
  }

  onRowUnselect($event: TableRowUnSelectEvent) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: $event.data,
    } as GridEvent<Role>);
  }

  loadRows($event: TableLazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
