import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import {
  DashboardItem,
  DashboardItemsTableView,
} from '@msh/shared/domain-models';
import { APIService } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { Observable } from 'rxjs';

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

  getById(id: string): Observable<ApiResult<DashboardItem>> {
    return this.apiService.get(`/DashboardItems/${id}`);
  }

  getAll(): Observable<ApiResult<any>> {
    return this.apiService.get<ApiResult<any>>(`/DashboardItems/GetAll`);
  }

  save(dashboardItems: DashboardItem): Observable<ApiResult<DashboardItem>> {
    return this.apiService.post<ApiResult<DashboardItem>, DashboardItem>(
      `/DashboardItems`,
      dashboardItems
    );
  }
  update(dashboardItems: DashboardItem): Observable<ApiResult<DashboardItem>> {
    return this.apiService.put<ApiResult<DashboardItem>, DashboardItem>(
      `/DashboardItems`,
      dashboardItems
    );
  }

  delete(dashboardItemsId: number): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<DashboardItem>>(
      `/DashboardItems/${dashboardItemsId}`
    );
  }

  downloadFileById(documentId: any): Observable<ApiResult<DashboardItem>> {
    return this.apiService.get<ApiResult<DashboardItem>>(
      `/DashboardItems/${documentId}`
    );
  }
}
