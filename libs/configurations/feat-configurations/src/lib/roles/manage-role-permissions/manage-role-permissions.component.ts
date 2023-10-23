import { CommonModule } from '@angular/common';
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import { RolesApiService } from '@msh/configurations/data-access-configurations';
import {Permission, PermissionCategory, Role} from '@msh/shared/domain-models';
import {
  GlobalToastService,
} from '@msh/shared/util-shared';
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
import {PermissionsApiService} from "@msh/configurations/data-access-configurations";
import {ActivatedRoute} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {forkJoin, switchMap} from "rxjs";

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

  totalRecords = 0;
  displayModal = false;
  permissions!: Permission[];
  permissionCategoryWithPermissions : PermissionCategoryWithPermissions[] = [];
  role!: Role;

  constructor(
    private readonly rolesService: RolesApiService,
    private readonly permissionsService: PermissionsApiService,
    private readonly toastService: GlobalToastService,
    private readonly route: ActivatedRoute,
  ) {
  }

  onNewClick() {
    this.displayModal = true;
  }

  async onFormSave() {
    this.role.permissions = this.permissions.filter(p => p.isTicked);
    await  this.rolesService.update(this.role)//.subscribe(response => response.isSuccessful ? this.toastService.showSuccess("Ndryshimet u ruajten") : this.toastService.showError("Ndodhi nje gabim"));
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    const roleId = this.route.snapshot.paramMap.get('id')
    if(roleId) {
      this.rolesService.loadRole(roleId).subscribe(p => {
        this.role = p.data
      })
    }
    const permissionCategoryResponse = this.permissionsService.loadPermissionCategories();
    const permissionResponse = this.permissionsService.loadPermissions();
    const rolePermissions = this.role.permissions ?? [];

    permissionResponse.subscribe(r => this.permissions = r.data)
    permissionCategoryResponse.subscribe(
      r => {
        for (const pc of r.data) {
          const item: PermissionCategoryWithPermissions = {
            PermissionCategory: pc,
            Permissions: this.permissions.filter(p => p.permissionCategory.name === pc.name)
          }
          this.permissionCategoryWithPermissions.push(item)
        }
      })

    for(const permission of this.permissions){
      permission.isTicked = rolePermissions.some(p => p.name === permission.name);
    }
  }
}

interface PermissionCategoryWithPermissions {
  PermissionCategory: PermissionCategory
  Permissions: Permission[]
}
