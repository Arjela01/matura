import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';

import { ProfileGroupApiService } from '@msh/configurations/data-access-configurations';
import { ProfileGroup } from '@msh/shared/domain-models';

import {
  GlobalToastService,
  GridEvent,
  GRID_ACTIONS,
} from '@msh/shared/util-shared';

import { BehaviorSubject } from 'rxjs';
import { ProfileGroupFormComponent } from '../profile-group-form/profile-group-form.component';
import { ProfileGroupGridComponent } from '../profile-group-grid/profile-group-grid.component';
import { RippleModule } from 'primeng/ripple';
import {TableLazyLoadEvent} from "primeng/table";

@UntilDestroy()
@Component({
  selector: 'msh-manage-profile-groups',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ProfileGroupFormComponent,
    ProfileGroupGridComponent,
    ToolbarModule,
    RippleModule,
  ],
  templateUrl: './manage-profile-groups.component.html',
  styleUrls: ['./manage-profile-groups.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageProfileGroupsComponent implements OnInit {
  private profileGroups$$ = new BehaviorSubject<ProfileGroup[]>([]);
  profileGroups$ = this.profileGroups$$.asObservable();
  filters: TableLazyLoadEvent | null = null;

  totalRecords = 0;
  selectedProfileGroup: ProfileGroup | null = null;
  selectedProfileGroups: ProfileGroup[] = [];
  displayModal = false;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly profileGroupService: ProfileGroupApiService,
    private readonly cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    return;
  }

  onNewClick() {
    this.displayModal = true;
    this.selectedProfileGroup = {} as ProfileGroup;
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message:
        'Jeni i sigurt që doni të fshini grupet e profileve të zgjedhura?',
      accept: () => {
        //this.profileGroupStore.deleteSelectedProfilegroups();
        this.toastService.showWarning('Grupet e profilit u fshinë');
      },
    });
  }

  onGridEvent(event: GridEvent<ProfileGroup | ProfileGroup[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedProfileGroups = [
          ...this.selectedProfileGroups,
          event.data as ProfileGroup,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedProfileGroups = this.selectedProfileGroups.filter(pf => {
          pf.id !== (event.data as ProfileGroup).id;
        });
        break;
      case GRID_ACTIONS.SELECT_MANY:
        this.selectedProfileGroups = [
          ...this.selectedProfileGroups,
          ...(event.data as ProfileGroup[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedProfileGroups = [];
        break;
      case GRID_ACTIONS.EDIT:
        // eslint-disable-next-line max-len
        this.selectedProfileGroup = Object.assign(
          {},
          event.data as ProfileGroup
        );
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message:
            'Jeni i sigurt që doni të fshini grupin e profilit të zgjedhur?',
          accept: () => {
            this.deleteProfileGroup(event.data as ProfileGroup);
          },
        });
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
  }

  onFormSave(profileGroup: ProfileGroup) {
    if (profileGroup.id) {
      this.updateProfileGroup(profileGroup);
    }
    if (!profileGroup.id) {
      this.addProfileGroup(profileGroup);
    }
  }

  getProfileGroups($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.profileGroupService
      .loadProfileGroups($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.profileGroups$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  addProfileGroup(profileGroup: ProfileGroup) {
    this.profileGroupService
      .save(profileGroup)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Grupi i profilit u shtua me sukses!');
          this.displayModal = false;
          this.getProfileGroups(this.filters as TableLazyLoadEvent);
          this.cd.detectChanges();
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së grupit të profilit së mesme!'
          );
      });
  }

  updateProfileGroup(profileGroup: ProfileGroup) {
    this.profileGroupService
      .update(profileGroup)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            'Profili i grupit u ndryshua me sukses!'
          );
          this.displayModal = false;
          this.getProfileGroups(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të profilit të grupit!'
          );
      });
  }

  deleteProfileGroup(profileGroup: ProfileGroup) {
    this.profileGroupService
      .delete(profileGroup.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Grupi i profilit u fshi me sukses!');
          this.getProfileGroups(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes të grupit të profilit!'
          );
      });
  }
}
