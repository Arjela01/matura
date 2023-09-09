import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { A1Z, A1ZTableView } from '@msh/applications/domain-application';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class A1ZApiService {
  constructor(private http: HttpClient, private apiService: APIService) {}

  loadA1Z(event: TableLazyLoadEvent): Observable<A1ZTableView> {
    return this.apiService.post('/A1Z/TableData', event);
  }

  getOne(id: any): Observable<ApiResult<A1Z>> {
    return this.apiService.get(`/A1Z/${id}`);
  }

  save(a1z: A1Z): Observable<ApiResult<A1Z>> {
    return this.apiService.post<ApiResult<A1Z>, A1Z>('/A1Z', a1z);
  }

  update(a1z: A1Z): Observable<ApiResult<A1Z>> {
    return this.apiService.post<ApiResult<A1Z>, A1Z>('/A1Z/Update', a1z);
  }

  delete(a1zId: string): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<A1Z>>(`/A1Z/${a1zId}`);
  }
}
