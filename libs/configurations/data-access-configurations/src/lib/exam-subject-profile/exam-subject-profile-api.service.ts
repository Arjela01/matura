import { Injectable } from '@angular/core';
import {
  ExamSubjectProfile,
  ExamSubjectProfileTableView,
} from '@msh/configurations/domain-configurations';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { catchError, map, Observable, shareReplay, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExamSubjectProfileApiService {
  constructor(private apiService: APIService) {}

  loadTableData(event: LazyLoadEvent): Observable<ExamSubjectProfileTableView> {
    return this.apiService.post(`/api/ExamSubjectProfile/TableData`, event);
  }

  save(
    examSubject: ExamSubjectProfile
  ): Observable<ApiResult<ExamSubjectProfile>> {
    return this.apiService
      .post<ApiResult<ExamSubjectProfile>, ExamSubjectProfile>(
        `/api/ExamSubjectProfile`,
        examSubject
      )
      .pipe(
        map(data => data),
        catchError(error => throwError(error)),
        shareReplay()
      );
  }

  update(
    examSubject: ExamSubjectProfile
  ): Observable<ApiResult<ExamSubjectProfile>> {
    return this.apiService
      .put<ApiResult<ExamSubjectProfile>, ExamSubjectProfile>(
        `/api/ExamSubjectProfile`,
        examSubject
      )
      .pipe(
        map(data => data),
        catchError(error => throwError(error)),
        shareReplay()
      );
  }

  delete(examSubjectId: string): Observable<ApiResult<unknown>> {
    return this.apiService
      .delete<ApiResult<ExamSubjectProfile>>(
        `/api/ExamSubjectProfile/${examSubjectId}`
      )
      .pipe(
        map(data => data),
        catchError(error => throwError(error)),
        shareReplay()
      );
  }
}
