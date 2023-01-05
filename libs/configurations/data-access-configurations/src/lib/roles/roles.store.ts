import { Injectable } from '@angular/core';
import { Role } from '@msh/configurations/domain-configurations';
import { GenericStoreStatus } from '@msh/shared/data-access-shared';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { LazyLoadEvent } from 'primeng/api';
import { switchMap, tap } from 'rxjs';
import { RolesApiService } from './roles-api.service';


export interface RolesState {
    currentFilter: LazyLoadEvent | null;
    roles: Role[];
    selectedRoleIds: number[];
    activeRole: Role | null;
    status: GenericStoreStatus;
    error: string | null;
}

const initialRolesState: RolesState = {
    currentFilter: null,
    roles: [],
    selectedRoleIds: [],
    activeRole: null,
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
export class RolesStore extends ComponentStore<RolesState> {
    constructor(private rolesApiService: RolesApiService) {
        super(initialRolesState);
    }

    //Effects
    loadRoles = this.effect<void>(filters$ =>
        filters$.pipe(
            tap(() => {
                this.patchState({
                    status: 'loading',
                    error: null,
                });
            }),
            switchMap(() => {
                return this.rolesApiService.loadDummyRoles().pipe(
                    tapResponse(
                        (roles: Role[]) => {
                            this.patchState({
                                status: 'success',
                                roles,
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
    readonly roles$ = this.select(state => state.roles);
    readonly hasSelectedRoles$ = this.select(
        state => !!state.selectedRoleIds.length
    );
    readonly activeRole$ = this.select(state => state.activeRole);

    //Updaters

    setActiveRole(role: Role | null) {
        this.patchState({ activeRole: role });
    }
    // if later is required to add new roles
    // addRole(role: Role) {
    //     const newRole = Object.assign({}, role, {
    //         code: this.get().roles.length + 1,
    //     });

    //     this.patchState(({ roles }) => ({
    //         roles: [...roles, newRole],
    //     }));
    // }

    updateRole(role: Role) {
        this.patchState(({ roles }) => ({
            roles: roles.map(r => {
                if (r.Id === role.Id) {
                    return role;
                }
                return r;
            }),
        }));
    }

    deleteRoles(role: Role) {
        this.patchState(({ roles }) => ({
            roles: roles.filter(r => r.code !== role.code),
        }));
    }

    deleteSelectedRole() {
        this.patchState(state => ({
            roles: state.roles.filter(
                r => !state.selectedRoleIds.includes(r.Id)
            ),
            selectedRoleIds: [],
        }));
    }

    selectRole(role: Role) {
        debugger
        this.patchState(({ selectedRoleIds }) => ({
            selectedRoleIds: [...selectedRoleIds, role.Id],
        }));
    }

    unSelectRole(role: Role) {
        this.patchState(({ selectedRoleIds }) => ({
            selectedRoleIds: selectedRoleIds.filter(
                r => r !== role.Id
            ),
        }));
    }

    selectRoles(roles: Role[]) {
        this.patchState({
            selectedRoleIds: roles.map(r => r.Id),
        });
    }

    unselectAllRoles() {
        this.patchState({
            selectedRoleIds: [],
        });
    }
}