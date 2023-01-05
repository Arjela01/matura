import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RolesStore } from '@msh/configurations/data-access-configurations';
import { Role } from '@msh/configurations/domain-configurations';
import { GlobalToastService, GridEvent, GRID_ACTIONS } from '@msh/shared/util-shared';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { RolesFormComponent } from '../roles-form/roles-form.component';
import { RolesGridComponent } from '../roles-grid/roles-grid.component';

@Component({
  selector: 'msh-manage-roles',
  standalone: true,
  imports: [ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    RolesFormComponent,
    RolesGridComponent,
    ToolbarModule,],
  templateUrl: './manage-roles.component.html',
  styleUrls: ['./manage-roles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RolesStore, ConfirmationService]
})
export class ManageRolesComponent {
  roles$ = this.rolesStore.roles$;
  hasSelectedRoles$ = this.rolesStore.hasSelectedRoles$;
  activeRole$ = this.rolesStore.activeRole$;

  rolesDialog = false;

  constructor(
    private readonly rolesStore: RolesStore,
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService
  ) { }

  ngOnInit(): void {
    this.rolesStore.loadRoles();
  }

  onNewClick() {
    this.rolesStore.setActiveRole(null);
    this.rolesDialog = true;
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete selected entities?',
      accept: () => {
        this.rolesStore.deleteSelectedRole();
        this.toastService.showWarning('Roles deleted!');
      },
    });
  }

  onGridEvent(event: GridEvent<Role | Role[]>) {
    console.log(event)
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.rolesStore.selectRole(event.data as Role);
        console.log('aaa', event.data)
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.rolesStore.unSelectRole(event.data as Role);
        break;
      case GRID_ACTIONS.SELECT_MANY:
        console.log('a')
        this.rolesStore.selectRoles(event.data as Role[]);
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.rolesStore.unselectAllRoles();
        break;
      case GRID_ACTIONS.EDIT:
        this.rolesStore.setActiveRole(event.data as Role);
        this.rolesDialog = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Are you sure that you want to delete this entity?',
          accept: () => {
            this.rolesStore.deleteRoles(event.data as Role);
            this.toastService.showWarning('Roles deleted!');
          },
        });
        break;
    }
  }

  onFormClose() {
    this.rolesDialog = false;
  }

  onFormSave(role: Role) {
    if (role.code) {
      this.rolesStore.updateRole(role);
      this.toastService.showSuccess('Roles Updated!');
    }
    // if (!role.code) {
    //   this.rolesStore.addRole(role);
    //   this.toastService.showSuccess('Roles Added!');
    // }
    this.rolesDialog = false;
  }
}
