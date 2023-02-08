import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Role, RoleTableView } from '@msh/shared/domain-models';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RolesApiService {
  constructor(private http: HttpClient, private apiService: APIService) {}
  loadRoles(event: LazyLoadEvent): Observable<RoleTableView> {
    return this.apiService.post(`/Role/TableData`, event);
  }

  save(role: Role): Observable<ApiResult<Role>> {
    return this.apiService.post<ApiResult<Role>, Role>(`/Role`, role);
  }

  update(role: Role): Observable<ApiResult<Role>> {
    return this.apiService.put<ApiResult<Role>, Role>(`/Role`, role);
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
