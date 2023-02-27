import { Injectable } from '@angular/core';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { Observable } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import {
  DashboardSection,
  DashboardSectionTableView,
} from './dashboard-section.model';

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

  getAll(): Observable<ApiResult<any>> {
    return this.apiService.get<ApiResult<any>>(
      `/DashboardSection`
    );
  }

  save(
    dashboardSection: DashboardSection
  ): Observable<ApiResult<DashboardSection>> {
    return this.apiService.post<ApiResult<DashboardSection>, DashboardSection>(
      `/DashboardSection`,
      dashboardSection
    );
  }
  update(
    dashboardSection: DashboardSection
  ): Observable<ApiResult<DashboardSection>> {
    return this.apiService.put<ApiResult<DashboardSection>, DashboardSection>(
      `/DashboardSection`,
      dashboardSection
    );
  }

  delete(dashboardSectionId: number): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<DashboardSection>>(
      `/DashboardSection/${dashboardSectionId}`
    );
  }
}
