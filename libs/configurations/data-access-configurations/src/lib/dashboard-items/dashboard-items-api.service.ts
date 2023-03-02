import { Injectable } from '@angular/core';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { Observable } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import {
  DashboardItems,
  DashboardItemsTableView, Student,
} from '@msh/shared/domain-models';
import {HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class DashboardItemsApiService {
  constructor(private apiService: APIService) {}


  loadDropdownList(
    current: number | null = null
  ): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<number>[]>>(
      `/DashboardItems/DropdownList`,
      current ? new HttpParams().append('ignore', current) : new HttpParams()
    );
  }
  loadDashboardItems(
    event: LazyLoadEvent
  ): Observable<DashboardItemsTableView> {
    return this.apiService.post(`/DashboardItems/TableData`, event);
  }

  getAll(): Observable<ApiResult<any>> {
    return this.apiService.get<ApiResult<any>>(
      `/DashboardItems`
    );
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


  downloadFileById(documentId: any): Observable<ApiResult<DashboardItems>> {
    return this.apiService.get<ApiResult<DashboardItems>>(
      `/DashboardItems/${documentId}`
    );
  }

}
