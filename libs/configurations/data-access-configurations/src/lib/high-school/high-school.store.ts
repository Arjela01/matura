import { Injectable } from '@angular/core';
import { HighSchool } from '@msh/configurations/domain-configurations';
import { GenericStoreStatus } from '@msh/shared/data-access-shared';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { LazyLoadEvent } from 'primeng/api';
import { map, switchMap, tap } from 'rxjs';
import { HighSchoolApiService } from './high-school-api.service';

export interface HighSchoolState {
  currentFilter: LazyLoadEvent | null;
  highSchools: HighSchool[];
  selectedHighSchoolsIds: number[];
  activeHighSchool: HighSchool | null;
  status: GenericStoreStatus;
  error: string | null;
}

const initialHighSchoolState: HighSchoolState = {
  currentFilter: null,
  highSchools: [],
  selectedHighSchoolsIds: [],
  activeHighSchool: null,
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
export class HighSchoolStore extends ComponentStore<HighSchoolState> {
  constructor(private highSchoolApiService: HighSchoolApiService) {
    super(initialHighSchoolState);
  }

  /*
  this.highSchoolApiService.loadHighSchools($event).subscribe(response => {
      const highSchools = response.data as HighSchool[];
      this.highSchoolStore.patchState({
        status: 'success',
        highSchools,
      })
    });


   */

  //Effects
  loadHighSchools = this.effect<LazyLoadEvent>(filters$ =>
    filters$.pipe(
      tap(() => {
        this.patchState({
          status: 'loading',
          error: null,
        });
      }),
      switchMap(payload => {
        return this.highSchoolApiService.loadHighSchools(payload).pipe(
          tapResponse(
            response => {
              const highSchools = response.data as HighSchool[];
              this.patchState({
                status: 'success',
                highSchools,
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
  readonly highSchools$ = this.select(state => state.highSchools);
  readonly hasSelectedHighSchools$ = this.select(
    state => !!state.selectedHighSchoolsIds.length
  );
  readonly activeHighSchool$ = this.select(state => state.activeHighSchool);

  //Updaters

  setActiveHighSchool(highSchool: HighSchool | null) {
    this.patchState({ activeHighSchool: highSchool });
  }

  addHighSchool(highSchool: HighSchool) {
    const newHighSchool = Object.assign({}, highSchool, {
      Id: this.get().highSchools.length + 1,
    });

    this.patchState(({ highSchools }) => ({
      highSchools: [...highSchools, newHighSchool],
    }));
  }

  updateHighSchool(highSchool: HighSchool) {
    this.patchState(({ highSchools }) => ({
      highSchools: highSchools.map(hs => {
        if (hs.id === highSchool.id) {
          return highSchool;
        }
        return hs;
      }),
    }));
  }

  deleteHighSchool(highSchool: HighSchool) {
    this.patchState(({ highSchools }) => ({
      highSchools: highSchools.filter(hs => hs.id !== highSchool.id),
    }));
  }

  deleteSelectedHighSchools() {
    this.patchState(state => ({
      highSchools: state.highSchools.filter(
        hs => !state.selectedHighSchoolsIds.includes(hs.id)
      ),
      selectedHighSchoolsIds: [],
    }));
  }

  selectHighSchool(highSchool: HighSchool) {
    this.patchState(({ selectedHighSchoolsIds }) => ({
      selectedHighSchoolsIds: [...selectedHighSchoolsIds, highSchool.id],
    }));
  }

  unSelectHighSchool(highSchool: HighSchool) {
    this.patchState(({ selectedHighSchoolsIds }) => ({
      selectedHighSchoolsIds: selectedHighSchoolsIds.filter(
        hs => hs !== highSchool.id
      ),
    }));
  }

  selectManySchools(highSchools: HighSchool[]) {
    this.patchState({
      selectedHighSchoolsIds: highSchools.map(hs => hs.id),
    });
  }

  unselectAllHighSchools() {
    this.patchState({
      selectedHighSchoolsIds: [],
    });
  }
}
