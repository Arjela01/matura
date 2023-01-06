import { Injectable } from '@angular/core';
import {ExamVersion} from '@msh/configurations/domain-configurations';
import { GenericStoreStatus } from '@msh/shared/data-access-shared';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { LazyLoadEvent } from 'primeng/api';
import {  switchMap, tap } from 'rxjs';
import { ExamVersionApiService } from './exam-version-api.service';

export interface ExamVersionState {
  currentFilter: LazyLoadEvent | null;
  examVersions: ExamVersion[];
  selectedExamVersionsIds: number[];
  activeExamVersion: ExamVersion | null;
  status: GenericStoreStatus;
  error: string | null;
}

const initialExamVersionState: ExamVersionState = {
  currentFilter: null,
  examVersions: [],
  selectedExamVersionsIds: [],
  activeExamVersion: null,
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
export class ExamVersionStore extends ComponentStore<ExamVersionState> {
  constructor(private examVersionApiService: ExamVersionApiService) {
    super(initialExamVersionState);
  }

  /*
  this.highSchoolApiService.loadExamVersions($event).subscribe(response => {
      const examVersions = response.data as HighSchool[];
      this.highSchoolStore.patchState({
        status: 'success',
        examVersions,
      })
    });


   */

  //Effects
  loadExamVersions = this.effect<LazyLoadEvent>(filters$ =>
    filters$.pipe(
      tap(() => {
        this.patchState({
          status: 'loading',
          error: null,
        });
      }),
      switchMap(payload => {
        return this.examVersionApiService.loadExamVersions(payload).pipe(
          tapResponse(
            response => {
              const examVersions = response.data as ExamVersion[];
              this.patchState({
                status: 'success',
                examVersions: examVersions,
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
  readonly examVersions$ = this.select(state => state.examVersions);
  readonly hasSelectedExamVersions$ = this.select(
    state => !!state.selectedExamVersionsIds.length
  );
  readonly activeExamVersions$ = this.select(state => state.activeExamVersion);

  //Updaters

  setActiveExamVersion(examVersion: ExamVersion | null) {
    this.patchState({ activeExamVersion: examVersion });
  }

  addExamVersion(examVersion: ExamVersion) {
    const newExamVersion = Object.assign({}, examVersion, {
      Id: this.get().examVersions.length + 1,
    });

    this.patchState(({ examVersions }) => ({
      examVersions: [...examVersions, newExamVersion],
    }));
  }

  updateExamVersion(examVersion: ExamVersion) {
    this.patchState(({ examVersions }) => ({
      examVersions: examVersions.map(ev => {
        if (ev.id === examVersion.id) {
          return examVersion;
        }
        return ev;
      }),
    }));
  }

  deleteExamVersion(examVersion: ExamVersion) {
    this.patchState(({ examVersions }) => ({
      examVersions: examVersions.filter(hs => hs.id !== examVersion.id),
    }));
  }

  deleteSelectedExamVersions() {
    this.patchState(state => ({
      examVersions: state.examVersions.filter(
        ev => !state.selectedExamVersionsIds.includes(ev.id)
      ),
      selectedExamVersionsIds: [],
    }));
  }

  selectExamVersion(examVersion: ExamVersion) {
    this.patchState(({ selectedExamVersionsIds }) => ({
      selectedExamVersionsIds: [...selectedExamVersionsIds, examVersion.id],
    }));
  }

  unSelectExamVersion(examVersion: ExamVersion) {
    this.patchState(({ selectedExamVersionsIds }) => ({
      selectedExamVersionsIds: selectedExamVersionsIds.filter(
        ev => ev !== examVersion.id
      ),
    }));
  }

  selectManyExamVersions(examVersions: ExamVersion[]) {
    this.patchState({
      selectedExamVersionsIds: examVersions.map(ev => ev.id),
    });
  }

  unselectAllExamVersions() {
    this.patchState({
      selectedExamVersionsIds: [],
    });
  }
}
