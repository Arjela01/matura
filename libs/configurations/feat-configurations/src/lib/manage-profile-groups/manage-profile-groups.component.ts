import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GlobalToastService } from '@msh/shared/util-shared';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';

import { GridEvent, GRID_ACTIONS } from '@msh/shared/util-shared';
import {ProfileGroup} from "@msh/configurations/domain-configurations";
import {
  ProfileGroupFormComponent, ProfileGroupGridComponent
} from "@msh/configurations/ui-configurations";
import { ProfileGroupStore} from "@msh/configurations/data-access-configurations";

@Component({
  selector: 'msh-manage-profile-groups',
  standalone: true,
  imports: [
  CommonModule,
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ToolbarModule,
    ProfileGroupGridComponent,
    ProfileGroupFormComponent,
  ],
  templateUrl: './manage-profile-groups.component.html',
  styleUrls: ['./manage-profile-groups.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProfileGroupStore, ConfirmationService],
})
export class ManageProfileGroupComponent implements OnInit {
  profileGroup$ = this.profileGroupStore.profileGroup$;
  hasSelectedProfileGroup$ = this.profileGroupStore.hasSelectedProfileGroup$;
  activeProfileGroup$ = this.profileGroupStore.activeProfileGroup$;

  profileGroupDialog = false;

  constructor(
    private readonly profileGroupStore: ProfileGroupStore,
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService
  ) {}

  ngOnInit(): void {
    this.profileGroupStore.loadProfileGroups();
  }

  onNewClick() {
    this.profileGroupStore.setActiveProfileGroup(null);
    this.profileGroupDialog = true;
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete selected entities?',
      accept: () => {
        this.profileGroupStore.deleteSelectedProfileGroup();
        this.toastService.showWarning('Profile Group deleted!');
      },
    });
  }

  onGridEvent(event: GridEvent<ProfileGroup | ProfileGroup[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.profileGroupStore.selectProfileGroup(event.data as ProfileGroup);
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.profileGroupStore.unSelectProfileGroup(event.data as ProfileGroup);
        break;
      case GRID_ACTIONS.SELECT_MANY:
        this.profileGroupStore.selectManyProfileGroup(event.data as ProfileGroup[]);
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.profileGroupStore.unselectAllProfileGroup();
        break;
      case GRID_ACTIONS.EDIT:
        this.profileGroupStore.setActiveProfileGroup(event.data as ProfileGroup);
        this.profileGroupDialog = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Are you sure that you want to delete this entity?',
          accept: () => {
            this.profileGroupStore.deleteProfileGroup(event.data as ProfileGroup);
            this.toastService.showWarning('Profile Group deleted!');
          },
        });
        break;
    }
  }

  onFormClose() {
    this.profileGroupDialog = false;
  }

  onFormSave(profileGroup: ProfileGroup) {
    if (profileGroup.Id) {
      this.profileGroupStore.updateProfileGroup(profileGroup);
      this.toastService.showSuccess('Profile Group Updated!');
    }
    if (!profileGroup.Id) {
      this.profileGroupStore.addProfileGroup(profileGroup);
      this.toastService.showSuccess('Profile Group Added!');
    }
    this.profileGroupDialog = false;
  }
}
