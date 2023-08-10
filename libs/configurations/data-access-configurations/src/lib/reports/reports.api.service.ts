import { Injectable } from '@angular/core';
import {
  Reports,
  ReportsTable,
} from '@msh/configurations/domain-configurations';
import { ApiResult } from '@msh/shared/data-access-shared';
import { A1ZCategory } from '@msh/shared/domain-models';
import { APIService } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportsApiService {
  constructor(private apiService: APIService) {}
  loadReports(event: TableLazyLoadEvent): Observable<ReportsTable> {
    return this.apiService.post(`/AppReport/TableData`, event);
  }

  save(report: Reports): Observable<ApiResult<Reports>> {
    return this.apiService.post<ApiResult<Reports>, Reports>(
      `/AppReport`,
      report
    );
  }
  update(report: Reports): Observable<ApiResult<Reports>> {
    return this.apiService.put<ApiResult<Reports>, Reports>(
      `/AppReport`,
      report
    );
  }

  delete(report: string | undefined): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<A1ZCategory>>(
      `/AppReport/${report}`
    );
  }
  loadRoleReports(event: TableLazyLoadEvent): Observable<ReportsTable> {
    return this.apiService.post(`/RoleAppReport/TableData`, event);
  }
}
