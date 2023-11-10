import { Injectable } from '@angular/core';
import { Menu, MenuTableView } from '@msh/shared/domain-models';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MenuApiService {
  constructor(private apiService: APIService) {}

  loadMenus(event: TableLazyLoadEvent): Observable<any> {
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

  update(menu: any): Observable<ApiResult<Menu>> {
    return this.apiService.post<ApiResult<Menu>, Menu>(`/Menu/Update`, menu);
  }

  delete(menu: number): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<Menu>>(`/Menu/${menu}`);
  }
}
