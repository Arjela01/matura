import { Injectable } from '@angular/core';
import { GenericStoreStatus } from '@msh/shared/data-access-shared';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { switchMap, tap } from 'rxjs';
import { ProfileGroupApiService } from './profile-group-api.service';
import { ProfileGroup} from "@msh/configurations/domain-configurations";
import {LazyLoadEvent} from "primeng/api";

export interface ProfileGroupState {
  currentFilter: LazyLoadEvent | null;
  profileGroups: ProfileGroup[];
  selectedProfileGroupsIds: number[];
  activeProfileGroup: ProfileGroup | null;
  status: GenericStoreStatus;
  error: string | null;
}

const initialProfileGroupState: ProfileGroupState = {
  currentFilter: null,
  profileGroups: [],
  selectedProfileGroupsIds: [],
  activeProfileGroup: null,
  status: 'initial',
  error: null,
};

const initialFilters: LazyLoadEvent = {
  first: 0,
  rows: 10,
  sortField: undefined,
  sortOrder: 1,
};

@Injectable()
export class ProfileGroupStore extends ComponentStore<ProfileGroupState> {
  constructor(private profileGroupApiService: ProfileGroupApiService) {
    super(initialProfileGroupState);
  }

  //Effects
  loadProfileGroups = this.effect<void>(filters$ =>
    filters$.pipe(
      tap(() => {
        this.patchState({
          status: 'loading',
          error: null,
        });
      }),
      switchMap(() => {
        return this.profileGroupApiService.loadDummyProfileGroup().pipe(
          tapResponse(
            (profileGroups: ProfileGroup[]) => {
              this.patchState({
                status: 'success',
                profileGroups,
              });
            },
            error => {
              this.patchState({
                status: 'error',
                error: error as string,
              });
            }
          )
        );
      })
    )
  );

  //Selectors
  readonly profileGroup$ = this.select(state => state.profileGroups);
  readonly hasSelectedProfileGroup$ = this.select(
    state => !!state.selectedProfileGroupsIds.length
  );
  readonly activeProfileGroup$ = this.select(state => state.activeProfileGroup);

  //Updaters

  setActiveProfileGroup(profileGroup: ProfileGroup | null) {
    this.patchState({ activeProfileGroup: profileGroup });
  }

  addProfileGroup(profileGroup: ProfileGroup) {
    const newProfileGroup = Object.assign({}, profileGroup, {
      Id: this.get().profileGroups.length + 1,
    });

    this.patchState(({ profileGroups }) => ({
      profileGroups: [...profileGroups, newProfileGroup],
    }));
  }

  updateProfileGroup(profileGroup: ProfileGroup) {
    this.patchState(({ profileGroups }) => ({
      profileGroups: profileGroups.map(pg => {
        if (pg.Id === profileGroup.Id) {
          return profileGroup;
        }
        return pg;
      }),
    }));
  }

  deleteProfileGroup(profileGroup: ProfileGroup) {
    this.patchState(({ profileGroups }) => ({
      profileGroups: profileGroups.filter(pg => pg.Id !== profileGroup.Id),
    }));
  }

  deleteSelectedProfileGroup() {
    this.patchState(state => ({
      profileGroups: state.profileGroups.filter(
        pg => !state.selectedProfileGroupsIds.includes(pg.Id)
      ),
      selectedHighSchoolsIds: [],
    }));
  }

  selectProfileGroup(profileGroup: ProfileGroup) {
    this.patchState(({ selectedProfileGroupsIds }) => ({
      selectedProfileGroupsIds: [...selectedProfileGroupsIds, profileGroup.Id],
    }));
  }

  unSelectProfileGroup(profileGroup: ProfileGroup) {
    this.patchState(({ selectedProfileGroupsIds }) => ({
      selectedProfileGroupsIds: selectedProfileGroupsIds.filter(
        pg => pg !== profileGroup .Id
      ),
    }));
  }

  selectManyProfileGroup(profileGroup: ProfileGroup[]) {
    this.patchState({
      selectedProfileGroupsIds: profileGroup.map(pg => pg.Id),
    });
  }

  unselectAllProfileGroup() {
    this.patchState({
      selectedProfileGroupsIds: [],
    });
  }
}
