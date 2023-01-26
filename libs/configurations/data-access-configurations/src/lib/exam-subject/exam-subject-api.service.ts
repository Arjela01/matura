import { Injectable } from '@angular/core';
import {
  ExamSubject,
  ExamSubjectTableView,
} from '@msh/configurations/domain-configurations';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { catchError, map, Observable, shareReplay, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExamSubjectApiService {
  constructor(private apiService: APIService) {}

  loadExamSubjects(event: LazyLoadEvent): Observable<ExamSubjectTableView> {
    return this.apiService.post(`/api/ExamSubject/TableData`, event);
  }

  save(examSubject: ExamSubject): Observable<ApiResult<ExamSubject>> {
    return this.apiService
      .post<ApiResult<ExamSubject>, ExamSubject>(
        `/api/ExamSubject`,
        examSubject
      )
      .pipe(
        map(data => data),
        catchError(error => throwError(error)),
        shareReplay()
      );
  }

  update(examSubject: ExamSubject): Observable<ApiResult<ExamSubject>> {
    return this.apiService
      .put<ApiResult<ExamSubject>, ExamSubject>(`/api/ExamSubject`, examSubject)
      .pipe(
        map(data => data),
        catchError(error => throwError(error)),
        shareReplay()
      );
  }

  delete(examSubjectId: string): Observable<ApiResult<unknown>> {
    return this.apiService
      .delete<ApiResult<ExamSubject>>(`/api/ExamSubject/${examSubjectId}`)
      .pipe(
        map(data => data),
        catchError(error => throwError(error)),
        shareReplay()
      );
  }

  forExamType(
    examTypeId?: number
  ): Observable<ApiResult<DropdownModel<string>[]>> {
    return this.apiService.post<ApiResult<DropdownModel<string>[]>, any>(
      `/api/ExamSubject/ForExamType`,
      { examTypeId: examTypeId }
    );
  }
}
