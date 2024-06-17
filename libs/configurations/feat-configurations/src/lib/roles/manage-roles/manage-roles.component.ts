import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RolesApiService } from '@msh/configurations/data-access-configurations';

import { Role } from '@msh/shared/domain-models';
import {
  GlobalToastService,
  GridEvent,
  GRID_ACTIONS,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { BehaviorSubject } from 'rxjs';
import { RolesFormComponent } from '../roles-form/roles-form.component';
import { RolesGridComponent } from '../roles-grid/roles-grid.component';
import { RippleModule } from 'primeng/ripple';
import { TableLazyLoadEvent } from 'primeng/table';
import { Router } from '@angular/router';

@Component({
  selector: 'msh-manage-roles',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    RolesFormComponent,
    RolesGridComponent,
    ToolbarModule,
    RippleModule,
  ],
  templateUrl: './manage-roles.component.html',
  styleUrls: ['./manage-roles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
@UntilDestroy()
export class ManageRolesComponent {
  private roles$$ = new BehaviorSubject<Role[]>([]);
  roles$ = this.roles$$.asObservable();
  filters: TableLazyLoadEvent = {} as TableLazyLoadEvent;

  totalRecords = 0;
  selectedRole: Role | null = null;
  displayModal = false;

  constructor(
    private readonly rolesService: RolesApiService,
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly router: Router
  ) {}

  onGridEvent(event: GridEvent<Role | Role[]>) {
    switch (event.action) {
      case GRID_ACTIONS.EDIT:
        this.selectedRole = Object.assign({}, event.data as Role);
        this.router.navigate([
          '/configurations',
          'roles',
          this.selectedRole.id,
        ]);
        this.displayModal = true;
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
    this.selectedRole = null;
  }

  onFormSave(role: Role) {
    if (role.id) {
      this.updateRole(role);
    }
  }

  getRoles($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);
    this.rolesService
      .loadRoles($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.roles$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  updateRole(highSchool: Role) {
    this.rolesService
      .update(highSchool)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Roli u ndryshua me sukses!');
          this.displayModal = false;
          this.getRoles(this.filters);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së shkollës së mesme!'
          );
      });
  }
}
