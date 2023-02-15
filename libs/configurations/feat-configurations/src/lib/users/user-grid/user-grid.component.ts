import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { User } from '@msh/shared/domain-models';
import { GRID_ACTIONS, GridEvent } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import {RippleModule} from "primeng/ripple";

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
    RippleModule,
  ],
  templateUrl: './user-grid.component.html',
  styleUrls: ['./user-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserGridComponent {
  @Input() users: User[] = [];
  @Input() totalRecords = 0;

  selectedUsers: User[] = [];

  @Output() gridEvent = new EventEmitter<GridEvent<User | User[]>>();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  onKeyClick(user: User) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.CUSTOM_ACTION1,
      data: user,
    } as GridEvent<User>);
  }

  changeStatus(user: User): void {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_MANY,
      data: user,
    } as GridEvent<User>);
  }

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

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
