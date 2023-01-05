import { Injectable } from '@angular/core';
import { HighSchool } from '@msh/configurations/domain-configurations';
import { GenericStoreStatus } from '@msh/shared/data-access-shared';
import { GlobalToastService } from '@msh/shared/util-shared';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { LazyLoadEvent } from 'primeng/api';
import { switchMap, tap } from 'rxjs';
import { HighSchoolApiService } from './high-school-api.service';

const initialFilters: LazyLoadEvent = {
  first: 0,
  rows: 10,
  sortField: undefined,
  sortOrder: 1,
};

export interface HighSchoolState {
  currentFilter: LazyLoadEvent;
  highSchools: HighSchool[];
  totalRecords: number;
  selectedHighSchoolsIds: number[];
  activeHighSchool: HighSchool | null;
  status: GenericStoreStatus;
  error: string | null;
  isModalVisible: boolean;
}

const initialHighSchoolState: HighSchoolState = {
  currentFilter: initialFilters,
  highSchools: [],
  totalRecords: 0,
  selectedHighSchoolsIds: [],
  activeHighSchool: null,
  status: 'initial',
  isModalVisible: false,
  error: null,
};

@Injectable()
export class HighSchoolStore extends ComponentStore<HighSchoolState> {
  constructor(
    private highSchoolApiService: HighSchoolApiService,
    private readonly toastService: GlobalToastService
  ) {
    super(initialHighSchoolState);
  }

  //Effects
  loadHighSchools = this.effect<LazyLoadEvent>(filters$ =>
    filters$.pipe(
      tap(filters => {
        this.patchState({
          status: 'loading',
          error: null,
          currentFilter: filters,
        });
      }),
      switchMap(payload => {
        return this.highSchoolApiService.loadHighSchools(payload).pipe(
          tapResponse(
            response => {
              const highSchools = response.data as HighSchool[];
              this.patchState({
                status: 'success',
                totalRecords: response.total ?? 0,
                highSchools,
              });
            },
            error => {
              this.patchState({
                status: 'error',
                error: error as string,
              });

              this.toastService.showError(
                'Nje problem ndodhi me marrjen e shkollave të mesme!'
              );
            }
          )
        );
      })
    )
  );

  saveHighSchool = this.effect<HighSchool>(highSchool$ =>
    highSchool$.pipe(
      tap(() => {
        this.patchState({
          status: 'saving',
          error: null,
        });
      }),
      switchMap(highSchool => {
        return this.highSchoolApiService.save(highSchool).pipe(
          tapResponse(
            response => {
              if (response.isSuccessful) {
                this.loadHighSchools(this.get().currentFilter);

                this.patchState({
                  status: 'success',
                  isModalVisible: false,
                });
                this.toastService.showSuccess(
                  'Shkolla e mesme u shtua me sukses!'
                );
              }

              if (!response.isSuccessful) {
                this.patchState({
                  status: 'error',
                  error: response.errorMessage ?? 'Error!',
                });

                this.toastService.showError(response.errorMessage);
              }
            },
            error => {
              this.patchState({
                status: 'error',
                error: error as string,
              });

              this.toastService.showError(
                'Nje problem ndodhi me shtimin e shkollës së mesme!'
              );
            }
          )
        );
      })
    )
  );

  updateHighSchool = this.effect<HighSchool>(highSchool$ =>
    highSchool$.pipe(
      tap(() => {
        this.patchState({
          status: 'saving',
          error: null,
        });
      }),
      switchMap(highSchool => {
        return this.highSchoolApiService.update(highSchool).pipe(
          tapResponse(
            response => {
              if (response.isSuccessful) {
                this.loadHighSchools(this.get().currentFilter);

                this.patchState({
                  status: 'success',
                  isModalVisible: false,
                });
                this.toastService.showSuccess(
                  'Shkolla e mesme u ndryshua me sukses!'
                );
              }

              if (!response.isSuccessful) {
                this.patchState({
                  status: 'error',
                  error: response.errorMessage ?? 'Error!',
                });

                this.toastService.showError(response.errorMessage);
              }
            },
            error => {
              this.patchState({
                status: 'error',
                error: error as string,
              });

              this.toastService.showError(
                'Nje problem ndodhi me shtimin e shkollës së mesme!'
              );
            }
          )
        );
      })
    )
  );

  deleteHighSchool = this.effect<HighSchool>(highSchool$ =>
    highSchool$.pipe(
      tap(() => {
        this.patchState({
          status: 'deleting',
          error: null,
        });
      }),
      switchMap(highSchool => {
        return this.highSchoolApiService.delete(highSchool.id).pipe(
          tapResponse(
            response => {
              if (response.isSuccessful) {
                this.loadHighSchools(this.get().currentFilter);

                this.patchState({
                  status: 'success',
                  isModalVisible: false,
                });
                this.toastService.showSuccess(
                  'Shkolla e mesme u fshi me sukses!'
                );
              }

              if (!response.isSuccessful) {
                this.patchState({
                  status: 'error',
                  error: response.errorMessage ?? 'Error!',
                });
                this.toastService.showError(response.errorMessage);
              }
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
  readonly isModalVisible$ = this.select(state => state.isModalVisible);
  readonly highSchools$ = this.select(state => state.highSchools);
  readonly totalRecords$ = this.select(state => state.totalRecords);
  readonly hasSelectedHighSchools$ = this.select(
    state => !!state.selectedHighSchoolsIds.length
  );
  readonly activeHighSchool$ = this.select(state => state.activeHighSchool);

  //Updaters
  showModal() {
    this.patchState({ isModalVisible: true });
  }

  hideModal() {
    this.patchState({ isModalVisible: false });
  }

  setActiveHighSchool(highSchool: HighSchool | null) {
    this.patchState({ activeHighSchool: highSchool });
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
