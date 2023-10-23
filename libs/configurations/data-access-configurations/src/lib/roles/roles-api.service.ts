import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Permission, PermissionCategory, Role, RoleTableView} from '@msh/shared/domain-models';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RolesApiService {
  constructor(private http: HttpClient, private apiService: APIService) {}
  loadRoles(event: TableLazyLoadEvent): Observable<RoleTableView> {
    return this.apiService.post(`/Role/TableData`, event);
  }

  loadRole(roleId: string): Observable<ApiResult<Role>> {
    return this.apiService.get<ApiResult<Role>>(`/Role/${roleId}`)
  }

  save(role: Role): Observable<ApiResult<Role>> {
    return this.apiService.post<ApiResult<Role>, Role>(`/Role`, role);
  }

  update(role: Role): Observable<ApiResult<Role>> {
    return this.apiService.post<ApiResult<Role>, Role>(`/Role/Update`, role);
  }

  delete(roleId: string): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<Role>>(`/Role/${roleId}`);
  }

  loadDropdownList(): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<number>[]>>(
      `/Role/DropdownList`
    );
  }
}
