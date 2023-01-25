import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { Observable } from 'rxjs';
import {
  A1Z,
  A1ZTableView,
} from '../../../../domain-applications/a1z/a1z.model';

@Injectable({
  providedIn: 'root',
})
export class A1ZApiService {
  constructor(private http: HttpClient, private apiService: APIService) {}

  loadA1Z(event: LazyLoadEvent): Observable<A1ZTableView> {
    return this.apiService.post('/A1Z/TableData', event);
  }

  save(a1z: A1Z): Observable<ApiResult<A1Z>> {
    return this.apiService.post<ApiResult<A1Z>, A1Z>('/A1Z', a1z);
  }

  update(a1z: A1Z): Observable<ApiResult<A1Z>> {
    return this.apiService.put<ApiResult<A1Z>, A1Z>('/A1Z', a1z);
  }

  delete(a1zId: string): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<A1Z>>(`/A1Z/${a1zId}`);
  }
}
