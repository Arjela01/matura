import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TableLazyLoadEvent } from 'primeng/table';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { ExamDate, ExamDateTableView } from '@msh/shared/domain-models';

@Injectable({
  providedIn: 'root',
})
export class ExamDateApiService {
  constructor(private apiService: APIService) {}

  loadExamDates(event: TableLazyLoadEvent): Observable<ExamDateTableView> {
    return this.apiService.post(`/ExamDate/TableData`, event);
  }

  save(examDate: ExamDate): Observable<ApiResult<ExamDate>> {
    return this.apiService.post<ApiResult<ExamDate>, ExamDate>(
      `/ExamDate`,
      examDate
    );
  }

  update(examDate: ExamDate): Observable<ApiResult<ExamDate>> {
    return this.apiService.post<ApiResult<ExamDate>, ExamDate>(
      `/ExamDate/Update`,
      examDate
    );
  }

  delete(examDateId: string): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<ExamDate>>(
      `/ExamDate/${examDateId}`
    );
  }
  loadDropdownList(): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<number>[]>>(
      `/ExamDate/DropdownList`
    );
  }

  forExamSiteId(
    examSiteId?: string
  ): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<number>[]>>(
      `/ExamDate/ForExamSiteId/${examSiteId}`
    );
  }

  forExamSiteIds(
    examSiteIds?: string[]
  ): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.apiService.post<ApiResult<DropdownModel<number>[]>, any>(
      `/ExamDate/ForExamSites`,
        {ids: examSiteIds}
    );
  }

  forExamSiteAndExamType(
    examSiteId: string,
    examTypeId: number | undefined
  ): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.apiService.post<ApiResult<DropdownModel<number>[]>, any>(
      `/ExamDate/ForExamSiteAndExamType`,
      {
        examSiteId: examSiteId,
        examTypeId: examTypeId,
      }
    );
  }
}
