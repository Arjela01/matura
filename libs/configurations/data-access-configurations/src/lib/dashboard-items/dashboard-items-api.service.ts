import { Injectable } from '@angular/core';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { Observable } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import {
  DashboardItems,
  DashboardItemsTableView,
} from '@msh/shared/domain-models';

@Injectable({
  providedIn: 'root',
})
export class DashboardItemsApiService {
  constructor(private apiService: APIService) {}

  loadDropdownList(): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<number>[]>>(
      `/DashboardItems/DropdownList`
    );
  }

  loadDashboardItems(
    event: LazyLoadEvent
  ): Observable<DashboardItemsTableView> {
    return this.apiService.post(`/DashboardItems/TableData`, event);
  }

  save(dashboardItems: DashboardItems): Observable<ApiResult<DashboardItems>> {
    return this.apiService.post<ApiResult<DashboardItems>, DashboardItems>(
      `/DashboardItems`,
      dashboardItems
    );
  }
  update(
    dashboardItems: DashboardItems
  ): Observable<ApiResult<DashboardItems>> {
    return this.apiService.put<ApiResult<DashboardItems>, DashboardItems>(
      `/DashboardItems`,
      dashboardItems
    );
  }

  delete(dashboardItemsId: number): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<DashboardItems>>(
      `/DashboardItems/${dashboardItemsId}`
    );
  }
}
