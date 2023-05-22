import { Injectable } from '@angular/core';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { Observable } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import { ExamSite, ExamSiteTableView } from '@msh/shared/domain-models';

@Injectable({
  providedIn: 'root',
})
export class ExamSiteApiService {
  constructor(private apiService: APIService) {}

  loadDropdownList(): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<number>[]>>(
      `/ExamSite/DropdownList`
    );
  }
  loadExamSites(event: LazyLoadEvent): Observable<ExamSiteTableView> {
    return this.apiService.post(`/ExamSite/TableData`, event);
  }

  save(examSite: ExamSite): Observable<ApiResult<ExamSite>> {
    return this.apiService.post<ApiResult<ExamSite>, ExamSite>(
      `/ExamSite`,
      examSite
    );
  }

  update(examSite: ExamSite): Observable<ApiResult<ExamSite>> {
    return this.apiService.put<ApiResult<ExamSite>, ExamSite>(
      `/ExamSite`,
      examSite
    );
  }

  delete(examSiteId: number): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<ExamSite>>(
      `/ExamSite/${examSiteId}`
    );
  }
}
