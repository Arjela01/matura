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

  save(a1: A1): Observable<ApiResult<A1>> {
    return this.apiService.post<ApiResult<A1>, A1>(`/A1`, a1);
  }
  update(a1: A1): Observable<ApiResult<A1>> {
    return this.apiService.put<ApiResult<A1>, A1>(`/A1`, a1);
  }

  delete(a1: string): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<A1>>(`/A1/${a1}`);
  }
  loadD3Subjects() {
    return [
      { key: 1, parentKey: 1, value: 'ANGLISHT D3 (B1)' },
      { key: 2, parentKey: 1, value: 'ANGLISHT D3 (B2)' },
      { key: 3, parentKey: 1, value: 'FRENGJISHT (B1)' },
      { key: 4, parentKey: 1, value: 'FRENGJISHT (B2)' },
      { key: 5, parentKey: 1, value: 'GJERMANISHT (B1)' },
      { key: 6, parentKey: 1, value: 'ITALISHT (B1)' },
      { key: 7, parentKey: 1, value: 'ITALISHT (B2)' },
      { key: 8, parentKey: 1, value: 'NUK KAM DETYRIM' },
      { key: 9, parentKey: 1, value: 'RUSISHT (D3)' },
      { key: 10, parentKey: 1, value: 'SPANJISHT (B1)' },
      { key: 10, parentKey: 1, value: 'TURQISHT D3 (B1)' },
    ];
  }
}
