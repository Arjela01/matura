import { Injectable } from '@angular/core';
import { User } from '@msh/configurations/domain-configurations';
import { GenericStoreStatus } from '@msh/shared/data-access-shared';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { LazyLoadEvent } from 'primeng/api';
import { switchMap, tap } from 'rxjs';
import { UserApiService } from './user-api.service';

export interface UserState {
  currentFilter: LazyLoadEvent | null;
  users: User[];
  selectedUsersIds: number[];
  activeUsers: User | null;
  status: GenericStoreStatus;
  error: string | null;
}

const initialUserState: UserState = {
  currentFilter: null,
  users: [],
  selectedUsersIds: [],
  activeUsers: null,
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
export class UserStore extends ComponentStore<UserState> {
  constructor(private userApiService: UserApiService) {
    super(initialUserState);
  }

  //Effects
  loadusers = this.effect<void>(filters$ =>
    filters$.pipe(
      tap(() => {
        this.patchState({
          status: 'loading',
          error: null,
        });
      }),
      switchMap(() => {
        return this.userApiService.loadDummyHighSchools().pipe(
          tapResponse(
            (users: User[]) => {
              console.log(users);
              this.patchState({
                status: 'success',
                users,
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
  readonly users$ = this.select(state => state.users);
  readonly hasSelectedUsers$ = this.select(
    state => !!state.selectedUsersIds.length
  );
  readonly activeUsers$ = this.select(state => state.activeUsers);

  //Updaters

  setActiveUser(user: User | null) {
    this.patchState({ activeUsers: user });
  }

  addUser(user: User) {
    const newUser = Object.assign({}, user, {
      Id: this.get().users.length + 1,
    });

    this.patchState(({ users }) => ({
      users: [...users, newUser],
    }));
  }

  updateUser(user: User) {
    this.patchState(({ users }) => ({
      users: users.map(u => {
        if (u.id === user.id) {
          return user;
        }
        return u;
      }),
    }));
  }

  deleteUser(user: User) {
    this.patchState(({ users }) => ({
      users: users.filter(u => u.id !== user.id),
    }));
  }

  deleteSelectedUsers() {
    this.patchState(state => ({
      users: state.users.filter(u => !state.selectedUsersIds.includes(u.id)),
      selectedUsersIds: [],
    }));
  }

  selectUser(user: User) {
    this.patchState(({ selectedUsersIds }) => ({
      selectedUsersIds: [...selectedUsersIds, user.id],
    }));
  }

  unSelectUser(user: User) {
    this.patchState(({ selectedUsersIds }) => ({
      selectedUsersIds: selectedUsersIds.filter(u => u !== user.id),
    }));
  }

  selectManyUsers(users: User[]) {
    this.patchState({
      selectedUsersIds: users.map(u => u.id),
    });
  }

  unselectAllUsers() {
    this.patchState({
      selectedUsersIds: [],
    });
  }
}
