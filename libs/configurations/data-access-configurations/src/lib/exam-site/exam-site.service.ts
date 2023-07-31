import { Injectable } from '@angular/core';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { Observable } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import { ExamSite, ExamSiteTableView, User } from '@msh/shared/domain-models';

@Injectable({
  providedIn: 'root',
})
export class ExamSiteApiService {
  constructor(private apiService: APIService) {}

  loadDropdownList(): Observable<ApiResult<DropdownModel<string>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<string>[]>>(
      `/ExamSite/DropdownList`
    );
  }
  loadExamSites(event: LazyLoadEvent): Observable<ExamSiteTableView> {
    return this.apiService.post(`/ExamSite/TableData`, event);
  }

  forAdministrationOffice(
    administrationOfficeId?: number
  ): Observable<ApiResult<DropdownModel<string>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<string>[]>>(
      `/ExamSite/ForAdministrationOffice/${administrationOfficeId}`
    );
  }

  save(examSite?: ExamSite): Observable<ApiResult<ExamSite>> {
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
  getExamSiteById(examSiteId: string): Observable<ApiResult<ExamSite>> {
    return this.apiService.get(`/ExamSite/${examSiteId}`);
  }

  delete(examSiteId: number): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<ExamSite>>(
      `/ExamSite/${examSiteId}`
    );
  }
}
