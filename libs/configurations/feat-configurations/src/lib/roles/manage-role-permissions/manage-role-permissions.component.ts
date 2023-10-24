import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { RolesApiService } from '@msh/configurations/data-access-configurations';
import {
  Permission,
  PermissionCategory,
  Role,
} from '@msh/shared/domain-models';
import { GlobalToastService } from '@msh/shared/util-shared';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { RolesFormComponent } from '../roles-form/roles-form.component';
import { RolesGridComponent } from '../roles-grid/roles-grid.component';
import { RippleModule } from 'primeng/ripple';
import { TableLazyLoadEvent } from 'primeng/table';
import { PermissionsApiService } from '@msh/configurations/data-access-configurations';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
    FormsModule,
  ],
  templateUrl: './manage-role-permissions.component.html',
  styleUrls: ['./manage-role-permissions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
@UntilDestroy()
export class ManageRolePermissionsComponent implements OnInit {
  filters: TableLazyLoadEvent = {} as TableLazyLoadEvent;

  displayModal = false;
  permissions!: Set<Permission>;
  role!: Role;
  roleId: string | unknown;
  permissionCategories: PermissionCategory[] = [];

  constructor(
    private readonly rolesService: RolesApiService,
    private readonly permissionsService: PermissionsApiService,
    private readonly toastService: GlobalToastService,
    private readonly route: ActivatedRoute,
    private readonly cd: ChangeDetectorRef
  ) {}

  async onFormSave() {
    this.role.permissions = Array.from(this.permissions).filter(
      p => p.isTicked
    );
    this.rolesService.update(this.role).subscribe(response => {
      response.isSuccessful
        ? this.toastService.showSuccess('Ndryshimet u ruajtën')
        : this.toastService.showError('Ndodhi një gabim');
    });
  }

  ngOnInit(): void {
    this.roleId = this.route.snapshot.paramMap.get('id');

    this.loadData();
  }

  loadData() {
    if (!this.roleId) {
      return;
    }

    this.permissionsService.loadPermissionCategories().subscribe(r => {
      if (r.isSuccessful) {
        this.permissionCategories = r.data;
        this.permissions = new Set();
        for (const category of this.permissionCategories) {
          this.permissions = new Set([
            ...this.permissions,
            ...category.permissions,
          ]);
        }

        this.rolesService.loadRole(this.roleId as string).subscribe(p => {
          this.role = p.data;
          const rolePermissions = this.role.permissions ?? [];
          for (const permission of this.permissions) {
            permission.isTicked = rolePermissions.some(
              p => p.name === permission.name
            );
          }
          this.cd.detectChanges();
        });
      }
    });
  }
}

interface PermissionCategoryWithPermissions {
  PermissionCategory: PermissionCategory;
  Permissions: Permission[];
}
