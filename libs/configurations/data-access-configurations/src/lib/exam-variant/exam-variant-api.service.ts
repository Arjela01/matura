import { Injectable } from '@angular/core';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { ExamVariant, ExamVariantTableView } from '@msh/shared/domain-models';
import { APIService } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { catchError, map, Observable, shareReplay, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExamVariantApiService {
  constructor(private apiService: APIService) {}

  loadExamVariants(
    event: TableLazyLoadEvent
  ): Observable<ExamVariantTableView> {
    return this.apiService.post(`/ExamVariant/TableData`, event);
  }

  save(examVariant: ExamVariant): Observable<ApiResult<ExamVariant>> {
    return this.apiService
      .post<ApiResult<ExamVariant>, ExamVariant>(`/ExamVariant`, examVariant)
      .pipe(
        map(data => data),
        catchError(error => throwError(error)),
        shareReplay()
      );
  }

  update(examVariant: ExamVariant): Observable<ApiResult<ExamVariant>> {
    return this.apiService
      .post<ApiResult<ExamVariant>, ExamVariant>(
        `/ExamVariant/Update`,
        examVariant
      )
      .pipe(
        map(data => data),
        catchError(error => throwError(error)),
        shareReplay()
      );
  }

  delete(examVariantId: string): Observable<ApiResult<unknown>> {
    return this.apiService
      .delete<ApiResult<ExamVariant>>(`/ExamVariant/${examVariantId}`)
      .pipe(
        map(data => data),
        catchError(error => throwError(error)),
        shareReplay()
      );
  }

  forExamSubject(
    examSubjectId: string,
    academicYearId: number
  ): Observable<ApiResult<DropdownModel<string>[]>> {
    const params = {
      examSubjectId: examSubjectId,
      academicYearId: academicYearId,
    };
    return this.apiService.post<ApiResult<DropdownModel<string>[]>, any>(
      `/ExamVariant/ForExamSubject`,
      params
    );
  }
  loadDropdownList(): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<number>[]>>(
      `/ExamVariant/DropdownList`
    );
  }
  getVariants(): Observable<ApiResult<ExamVariant[]>> {
    return this.apiService.get<ApiResult<ExamVariant[]>>(`/ExamVariant`);
  }
}
