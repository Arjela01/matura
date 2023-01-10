
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Role } from '@msh/configurations/domain-configurations';
import { GridEvent, GRID_ACTIONS } from '@msh/shared/util-shared';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
@Component({
  selector: 'msh-roles-grid',
  standalone: true,
  imports: [CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule],
  templateUrl: './roles-grid.component.html',
  styleUrls: ['./roles-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesGridComponent {
  @Input() roles: Role[] = [];

  //Keep it local state because of Table Header checkbox not syncing
  selectedRoles: Role[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<Role | Role[]>
  >();

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
    console.log('cccc')
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

  onRowSelect({ data }: { data: Role }) {
    console.log(data)
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: data,
    } as GridEvent<Role>);
  }

  onRowUnselect({ data }: { data: Role }) {
    console.log('b')
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: data,
    } as GridEvent<Role>);
  }
  ngOnInit() {
    console.log(this.selectedRoles.length)
  }
}
