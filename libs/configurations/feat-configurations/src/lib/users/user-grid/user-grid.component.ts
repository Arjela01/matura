import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { User } from '@msh/configurations/domain-configurations';
import { GRID_ACTIONS, GridEvent } from '@msh/shared/util-shared';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'msh-user-grid',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
  ],
  templateUrl: './user-grid.component.html',
  styleUrls: ['./user-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserGridComponent {
  @Input() users: User[] = [];

  selectedUsers: User[] = [];

  @Output() gridEvent = new EventEmitter<GridEvent<User | User[]>>();

  onEditClick(user: User) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: user,
    } as GridEvent<User>);
  }

  onDeleteClick(user: User) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: user,
    } as GridEvent<User>);
  }

  onSelectAllClick() {
    if (this.selectedUsers.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<User>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedUsers,
      } as GridEvent<User[]>);
    }
  }

  onRowSelect({ data }: { data: User }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: data,
    } as GridEvent<User>);
  }

  onRowUnselect({ data }: { data: User }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: data,
    } as GridEvent<User>);
  }
}
