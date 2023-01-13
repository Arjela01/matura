import { Injectable } from '@angular/core';
import { GenericStoreStatus } from '@msh/shared/data-access-shared';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { LazyLoadEvent } from 'primeng/api';
import { switchMap, tap } from 'rxjs';
import { Gender } from './../../../../domain-configurations/src/gender/gender.model';
import { GendersApiService } from './genders-api.service';


export interface GenderState {
    currentFilter: LazyLoadEvent | null;
    genders: Gender[];
    selectedGenderIds: number[];
    activeGender: Gender | null;
    status: GenericStoreStatus;
    error: string | null;
}

const initialGenderState: GenderState = {
    currentFilter: null,
    genders: [],
    selectedGenderIds: [],
    activeGender: null,
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
export class GenderStore extends ComponentStore<GenderState> {
    constructor(private genderApiService: GendersApiService) {
        super(initialGenderState);
    }

    //Effects
    loadGenders = this.effect<void>(filters$ =>
        filters$.pipe(
            tap(() => {
                this.patchState({
                    status: 'loading',
                    error: null,
                });
            }),
            switchMap(() => {
                return this.genderApiService.loadDummyGenders().pipe(
                    tapResponse(
                        (genders: Gender[]) => {
                            console.log(genders)
                            this.patchState({
                                status: 'success',
                                genders,
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
    readonly genders$ = this.select(state => state.genders);
    readonly hasSelectedGender$ = this.select(
        state => !!state.selectedGenderIds.length
    );
    readonly activeGender$ = this.select(state => state.activeGender);

    //Updaters

    setActiveGender(gender: Gender | null) {
        this.patchState({ activeGender: gender });
    }

    addGender(gender: Gender) {
        const newGender = Object.assign({}, gender, {
            Id: this.get().genders.length + 1,
        });

        this.patchState(({ genders }) => ({
            genders: [...genders, newGender],
        }));
    }

    updateGender(gender: Gender) {
        this.patchState(({ genders }) => ({
            genders: genders.map(g => {
                if (g.Id === gender.Id) {
                    return gender;
                }
                return g;
            }),
        }));
    }

    deleteGender(gender: Gender) {
        this.patchState(({ genders }) => ({
            genders: genders.filter(g => g.Id !== gender.Id),
        }));
    }

    deleteSelectedGenders() {
        this.patchState(state => ({
            genders: state.genders.filter(
                g => !state.selectedGenderIds.includes(g.Id)
            ),
            selectedGenderIds: [],
        }));
    }

    selectGender(gender: Gender) {
        this.patchState(({ selectedGenderIds }) => ({
            selectedGenderIds: [...selectedGenderIds, gender.Id],
        }));
    }

    unSelectGender(gender: Gender) {
        this.patchState(({ selectedGenderIds }) => ({
            selectedGenderIds: selectedGenderIds.filter(
                g => g !== gender.Id
            ),
        }));
    }

    selectManyGenders(genders: Gender[]) {
        this.patchState({
            selectedGenderIds: genders.map(hs => hs.Id),
        });
    }

    unselectAllGenders() {
        this.patchState({
            selectedGenderIds: [],
        });
    }
}
