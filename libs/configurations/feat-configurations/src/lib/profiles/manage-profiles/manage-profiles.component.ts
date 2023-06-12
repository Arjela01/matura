import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';

import { DropdownModel } from '@msh/shared/data-access-shared';
import { Profile } from '@msh/shared/domain-models';

import {
  GRID_ACTIONS,
  GlobalToastService,
  GridEvent,
} from '@msh/shared/util-shared';

import { AuthFacade } from '@msh/auth/data-access-auth';
import {
  ProfileApiService,
  ProfileGroupApiService,
} from '@msh/configurations/data-access-configurations';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import {
  BehaviorSubject,
  distinctUntilChanged,
  map,
  of,
  switchMap,
} from 'rxjs';
import { ProfileFormComponent } from '../profile-form/profile-form.component';
import { ProfileGridComponent } from '../profile-grid/profile-grid.component';

@UntilDestroy()
@Component({
  selector: 'msh-manage-profiles',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ProfileGridComponent,
    ProfileFormComponent,
    ToolbarModule,
    RippleModule,
  ],
  templateUrl: './manage-profiles.component.html',
  styleUrls: ['./manage-profiles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageProfilesComponent implements OnInit {
  private profiles$$ = new BehaviorSubject<Profile[]>([]);
  profiles$ = this.profiles$$.asObservable();
  filters: LazyLoadEvent | null = null;

  totalRecords = 0;
  selectedProfile: Profile | null = null;
  selectedProfiles: Profile[] = [];
  displayModal = false;

  ProfileGroups: DropdownModel<number>[] = [];

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly profileService: ProfileApiService,
    private readonly ProfileGroupsApiService: ProfileGroupApiService,
    private readonly cd: ChangeDetectorRef,
    private authFacade: AuthFacade
  ) {}

  ngOnInit(): void {
    this.getProfileGroupsDropdown();
    this.authFacade.academicYear$
      .pipe(
        map((data: any) => data.id),
        distinctUntilChanged(),
        switchMap(data => {
          if (this.filters) {
            window.location.reload();
          }

          return of([]);
        })
      )
      .subscribe();
  }

  onNewClick() {
    this.displayModal = true;
    this.selectedProfile = {} as Profile;
  }

  onGridEvent(event: GridEvent<Profile | Profile[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedProfiles = [
          ...this.selectedProfiles,
          event.data as Profile,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedProfiles = this.selectedProfiles.filter(pf => {
          pf.id !== (event.data as Profile).id;
        });
        break;
      case GRID_ACTIONS.SELECT_MANY:
        this.selectedProfiles = [
          ...this.selectedProfiles,
          ...(event.data as Profile[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedProfiles = [];
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedProfile = Object.assign({}, event.data as Profile);
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt që doni të fshini profilin e zgjedhur?',
          accept: () => {
            this.deleteProfile(event.data as Profile);
          },
        });
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
  }

  onFormSave(profile: Profile) {
    if (profile.id) {
      this.updateProfile(profile);
    }
    if (!profile.id) {
      this.addProfile(profile);
    }
  }

  getProfiles($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.profileService
      .loadProfiles($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.profiles$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  addProfile(profile: Profile) {
    this.profileService
      .save(profile)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Profili u shtua me sukses!');
          this.displayModal = false;
          this.getProfiles(this.filters as LazyLoadEvent);
          this.cd.detectChanges();
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të profilit!'
          );
      });
  }

  updateProfile(profile: Profile) {
    this.profileService
      .update(profile)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Profili u ndryshua me sukses!');
          this.displayModal = false;
          this.getProfiles(this.filters as LazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të profilit!'
          );
      });
  }

  deleteProfile(profile: Profile) {
    this.profileService
      .delete(profile.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Profili u fshi me sukses!');
          this.getProfiles(this.filters as LazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes së profilit!'
          );
      });
  }

  getProfileGroupsDropdown() {
    this.ProfileGroupsApiService.loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.ProfileGroups = response.data;
      });
  }
}
