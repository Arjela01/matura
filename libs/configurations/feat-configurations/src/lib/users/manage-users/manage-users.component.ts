import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UserStore } from '@msh/configurations/data-access-configurations';
import { User } from '@msh/configurations/domain-configurations';
import {
  GRID_ACTIONS,
  GlobalToastService,
  GridEvent,
} from '@msh/shared/util-shared';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { UserFormComponent } from '../user-form/user-form.component';
import { UserGridComponent } from '../user-grid/user-grid.component';

@Component({
  selector: 'msh-manage-users',
  standalone: true,
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ToolbarModule,
    UserGridComponent,
    UserFormComponent,
  ],
  providers: [UserStore, ConfirmationService],
})
export class ManageUsersComponent implements OnInit {
  users$ = this.userStore.users$;
  hasSelectedUsers$ = this.userStore.hasSelectedUsers$;
  activeUser$ = this.userStore.activeUsers$;

  userDialog = false;

  constructor(
    private readonly userStore: UserStore,
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService
  ) {}

  ngOnInit(): void {
    this.userStore.loadusers();
  }

  onNewClick() {
    this.userStore.setActiveUser(null);
    this.userDialog = true;
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete selected entities?',
      accept: () => {
        this.userStore.deleteSelectedUsers();
        this.toastService.showWarning('Users deleted!');
      },
    });
  }

  onGridEvent(event: GridEvent<User | User[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.userStore.selectUser(event.data as User);
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.userStore.unSelectUser(event.data as User);
        break;
      case GRID_ACTIONS.SELECT_MANY:
        this.userStore.selectManyUsers(event.data as User[]);
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.userStore.unselectAllUsers();
        break;
      case GRID_ACTIONS.EDIT:
        this.userStore.setActiveUser(event.data as User);
        this.userDialog = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Are you sure that you want to delete this entity?',
          accept: () => {
            this.userStore.deleteUser(event.data as User);
            this.toastService.showWarning('User deleted!');
          },
        });
        break;
    }
  }

  onFormClose() {
    this.userDialog = false;
  }

  onFormSave(user: User) {
    if (user.id) {
      this.userStore.updateUser(user);
      this.toastService.showSuccess('User Updated!');
    }
    if (!user.id) {
      this.userStore.addUser(user);
      this.toastService.showSuccess('User Added!');
    }
    this.userDialog = false;
  }
}
