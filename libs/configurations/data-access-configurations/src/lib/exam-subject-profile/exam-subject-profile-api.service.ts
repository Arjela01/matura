import { Injectable } from '@angular/core';
import {
  ExamSubjectProfile,
  ExamSubjectProfileTableView,
} from '@msh/shared/domain-models';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { catchError, map, Observable, shareReplay, throwError } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ExamSubjectProfileApiService {
  constructor(private apiService: APIService) {}

  loadTableData(event: TableLazyLoadEvent): Observable<ExamSubjectProfileTableView> {
    return this.apiService.post(`/ExamSubjectProfile/TableData`, event);
  }

  save(
    examSubjectProfile: ExamSubjectProfile
  ): Observable<ApiResult<ExamSubjectProfile>> {
    return this.apiService
      .post<ApiResult<ExamSubjectProfile>, ExamSubjectProfile>(
        `/ExamSubjectProfile`,
        examSubjectProfile
      )
      .pipe(
        map(data => data),
        catchError(error => throwError(error)),
        shareReplay()
      );
  }

  update(
    examSubjectProfile: ExamSubjectProfile
  ): Observable<ApiResult<ExamSubjectProfile>> {
    return this.apiService
      .put<ApiResult<ExamSubjectProfile>, ExamSubjectProfile>(
        `/ExamSubjectProfile`,
        examSubjectProfile
      )
      .pipe(
        map(data => data),
        catchError(error => throwError(error)),
        shareReplay()
      );
  }

  delete(id?: number): Observable<ApiResult<unknown>> {
    return this.apiService
      .delete<ApiResult<ExamSubjectProfile>>(`/ExamSubjectProfile/${id}`)
      .pipe(
        map(data => data),
        catchError(error => throwError(error)),
        shareReplay()
      );
  }
  exportTemplate(): Observable<ApiResult<unknown>> {
    return this.apiService.get<any>(
      `/ExamSubjectProfile/Export`,
      new HttpParams(),
      'blob'
    );
  }
}
