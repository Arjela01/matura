import { Injectable } from '@angular/core';
import { Menu, MenuTableView } from '@msh/configurations/domain-configurations';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MenuApiService {
  constructor(private apiService: APIService) {}

  loadMenus(event: LazyLoadEvent): Observable<MenuTableView> {
    return this.apiService.post(`/Menu/TableData`, event);
  }

  loadDropdownList(
    current: number | null = null
  ): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<number>[]>>(
      `/Menu/DropdownList`,
      current ? new HttpParams().append('ignore', current) : new HttpParams()
    );
  }

  save(menu: Menu): Observable<ApiResult<Menu>> {
    return this.apiService.post<ApiResult<Menu>, Menu>(`/Menu`, menu);
  }

  update(menu: Menu): Observable<ApiResult<Menu>> {
    return this.apiService.put<ApiResult<Menu>, Menu>(`/Menu`, menu);
  }

  delete(menu: number): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<Menu>>(`/Menu/${menu}`);
  }
}
