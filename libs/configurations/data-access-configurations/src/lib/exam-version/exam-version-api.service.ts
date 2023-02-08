import { Injectable } from '@angular/core';
import { catchError, map, Observable, shareReplay, throwError } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import {
  ExamVersion,
  ExamVersionTableView,
} from '@msh/shared/domain-models';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';

@Injectable({
  providedIn: 'root',
})
export class ExamVersionApiService {
  constructor(private apiService: APIService) {}

  loadExamVersions(event: LazyLoadEvent): Observable<ExamVersionTableView> {
    return this.apiService.post(`/ExamVersion/TableData`, event);
  }

  save(examVersion: ExamVersion): Observable<ApiResult<ExamVersion>> {
    return this.apiService
      .post<ApiResult<ExamVersion>, ExamVersion>(
        `/ExamVersion`,
        examVersion
      )
      .pipe(
        map(data => data),
        catchError(error => throwError(error)),
        shareReplay()
      );
  }

  update(examVersion: ExamVersion): Observable<ApiResult<ExamVersion>> {
    return this.apiService
      .put<ApiResult<ExamVersion>, ExamVersion>(`/ExamVersion`, examVersion)
      .pipe(
        map(data => data),
        catchError(error => throwError(error)),
        shareReplay()
      );
  }

  delete(examVersionId: string): Observable<ApiResult<unknown>> {
    return this.apiService
      .delete<ApiResult<ExamVersion>>(`/ExamVersion/${examVersionId}`)
      .pipe(
        map(data => data),
        catchError(error => throwError(error)),
        shareReplay()
      );
  }

  forExamSubject(
    examSubjectId: string
  ): Observable<ApiResult<DropdownModel<string>[]>> {
    return this.apiService.post<ApiResult<DropdownModel<string>[]>, any>(
      `/ExamVersion/ForExamSubject`,
      { examSubjectId: examSubjectId }
    );
  }
  loadDropdownList(): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<number>[]>>(
      `/ExamVersion/DropdownList`
    );
  }
}
