import {Injectable} from '@angular/core';
import {GenericStoreStatus} from '@msh/shared/data-access-shared';
import {ComponentStore, tapResponse} from '@ngrx/component-store';
import {LazyLoadEvent} from 'primeng/api';
import {switchMap, tap} from 'rxjs';
import {ExamTypeApiService} from './exam-type-api.service';
import {ExamType} from "@msh/configurations/domain-configurations";

export interface ExamTypeState {
  currentFilter: LazyLoadEvent | null;
  examTypes: ExamType[];
  selectedExamTypesIds: number[];
  activeExamType: ExamType | null;
  status: GenericStoreStatus;
  error: string | null;
}

const initialExamTypeState: ExamTypeState = {
  currentFilter: null,
  examTypes: [],
  selectedExamTypesIds: [],
  activeExamType: null,
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
export class ExamTypeStore extends ComponentStore<ExamTypeState> {
  constructor(private examTypeApiService: ExamTypeApiService) {
    super(initialExamTypeState);
  }

  //Effects
  loadExamTypes = this.effect<LazyLoadEvent>(filters$ =>
    filters$.pipe(
      tap(() => {
        this.patchState({
          status: 'loading',
          error: null,
        });
      }),
      switchMap(payload => {
        return this.examTypeApiService.loadExamTypes(payload).pipe(
          tapResponse(
            response => {
              const examTypes = response.data as ExamType[]
              this.patchState({
                status: 'success',
                examTypes,

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
  readonly examTypes$ = this.select(state => state.examTypes);
  readonly hasSelectedExamTypes$ = this.select(
    state => !!state.selectedExamTypesIds.length
  );
  readonly activeExamTypes$ = this.select(state => state.activeExamType);

  //Updaters

  setActiveExamType(examType: ExamType | null) {
    this.patchState({activeExamType: examType});
  }

  addExamType(examType: ExamType) {
    const newExamType = Object.assign({}, examType, {
      Id: this.get().examTypes.length + 1,
    });

    this.patchState(({examTypes}) => ({
      examTypes: [...examTypes, newExamType],
    }));
  }

  updateExamType(examType: ExamType) {
    this.patchState(({examTypes}) => ({
      examTypes: examTypes.map(et => {
        if (et.id === examType.id) {
          return examType;
        }
        return et;
      }),
    }));
  }

  deleteExamType(examType: ExamType) {
    this.patchState(({examTypes}) => ({
      examTypes: examTypes.filter(et => et.id !== examType.id),
    }));
  }

  deleteSelectedExamTypes() {
    this.patchState(state => ({
      examTypes: state.examTypes.filter(
        et => !state.selectedExamTypesIds.includes(et.id)
      ),
      selectedExamTypesIds: [],
    }));
  }

  selectExamType(examType: ExamType) {
    this.patchState(({selectedExamTypesIds}) => ({
      selectedExamTypesIds: [...selectedExamTypesIds, examType.id],
    }));
  }

  unSelectExamType(examType: ExamType) {
    this.patchState(({selectedExamTypesIds}) => ({
      selectedExamTypesIds: selectedExamTypesIds.filter(
        et => et !== examType.id
      ),
    }));
  }

  selectManyExamTypes(examType: ExamType[]) {
    this.patchState({
      selectedExamTypesIds: examType.map(et => et.id),
    });
  }

  unselectAllExamTypes() {
    this.patchState({
      selectedExamTypesIds: [],
    });
  }
}
