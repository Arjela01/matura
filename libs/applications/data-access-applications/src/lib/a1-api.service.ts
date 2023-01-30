import { Injectable } from '@angular/core';
import { A1 } from '@msh/applications/domain-application';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class A1ApiService {
  constructor(private apiService: APIService) {}

  loadDropdownList(): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<number>[]>>(
      `/A1/DropdownList`
    );
  }

  loadA1(event: LazyLoadEvent): Observable<A1> {
    return this.apiService.post(`/A1/TableData`, event);
  }

  getById(a1Id: string): Observable<A1> {
    return this.apiService.getById(`/A1/${a1Id}`);
  }

  save(a1: A1): Observable<ApiResult<A1>> {
    return this.apiService.post<ApiResult<A1>, A1>(`/A1`, a1);
  }
  update(a1: A1): Observable<ApiResult<A1>> {
    return this.apiService.put<ApiResult<A1>, A1>(`/A1`, a1);
  }

  delete(a1: string): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<A1>>(`/A1/${a1}`);
  }
}
