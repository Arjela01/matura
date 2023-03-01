import { Injectable } from '@angular/core';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { Observable } from 'rxjs';

import { LazyLoadEvent } from 'primeng/api';
import {
  DashboardSection,
  DashboardSectionTableView,
} from '@msh/shared/domain-models';

@Injectable({
  providedIn: 'root',
})
export class DashboardSectionApiService {
  constructor(private apiService: APIService) {}

  loadDropdownList(): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<number>[]>>(
      `/DashboardSection/DropdownList`
    );
  }
  loadDashboardSection(
    event: LazyLoadEvent
  ): Observable<DashboardSectionTableView> {
    return this.apiService.post(`/DashboardSection/TableData`, event);
  }

  save(
    dashboardSection: DashboardSection
  ): Observable<ApiResult<DashboardSection>> {
    return this.apiService.post<ApiResult<DashboardSection>, DashboardSection>(
      `/DashboardSection`,
      dashboardSection
    );
  }
}
