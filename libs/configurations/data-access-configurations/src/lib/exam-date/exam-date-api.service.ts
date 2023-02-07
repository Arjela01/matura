import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import {
  ExamDate,
  ExamDateTableView
} from "@msh/shared/domain-models";

@Injectable({
  providedIn: 'root',
})
export class ExamDateApiService {
  constructor(private apiService: APIService) {}

  loadExamDates(event: LazyLoadEvent): Observable<ExamDateTableView> {
    return this.apiService.post(`/ExamDate/TableData`, event);
  }

  save(examDate: ExamDate): Observable<ApiResult<ExamDate>> {
    return this.apiService.post<ApiResult<ExamDate>, ExamDate>(
      `/ExamDate`,
      examDate
    );
  }

  update(examDate: ExamDate): Observable<ApiResult<ExamDate>> {
    return this.apiService.put<ApiResult<ExamDate>, ExamDate>(
      `/ExamDate`,
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
    examSiteId: string
  ): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<number>[]>>(
      `/ExamDate/ForExamSiteId/${examSiteId}`
    );
  }
}
