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

@Component({
  selector: 'msh-manage-role-permissions',
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
  templateUrl: './manage-role-permissions.component.html',
  styleUrls: ['./manage-role-permissions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
@UntilDestroy()
export class ManageRolePermissionsComponent {
  filters: TableLazyLoadEvent = {} as TableLazyLoadEvent;

  totalRecords = 0;
  displayModal = false;

  constructor(
    private readonly rolesService: RolesApiService,
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService
  ) {}

  onNewClick() {
    this.displayModal = true;
  }

  onFormSave(role: Role) {

  }
}
