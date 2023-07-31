import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { ExamType, ExamTypeTableView } from '@msh/shared/domain-models';

@Injectable({
  providedIn: 'root',
})
export class ExamTypeApiService {
  constructor(private apiService: APIService) {}

  loadExamTypes(event: LazyLoadEvent): Observable<ExamTypeTableView> {
    return this.apiService.post(`/ExamType/TableData`, event);
  }

  save(examType: ExamType): Observable<ApiResult<ExamType>> {
    return this.apiService.post<ApiResult<ExamType>, ExamType>(
      `/ExamType`,
      examType
    );
  }

  update(examType: ExamType): Observable<ApiResult<ExamType>> {
    return this.apiService.put<ApiResult<ExamType>, ExamType>(
      `/ExamType`,
      examType
    );
  }

  delete(examTypeId: string): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<ExamType>>(
      `/ExamType/${examTypeId}`
    );
  }

  loadDropdownList(): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<number>[]>>(
      `/ExamType/DropdownList`
    );
  }

  getExamTypesForSiteId(examSiteId: string): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<number>[]>>(
      `/ExamSite/GetExamTypesForSiteId/${examSiteId}`
    );
  }
}
