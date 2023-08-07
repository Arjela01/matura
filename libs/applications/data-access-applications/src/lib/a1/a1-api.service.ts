import { Injectable } from '@angular/core';
import { A1Z } from '@msh/applications/domain-application';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { catchError, map, Observable, throwError } from 'rxjs';

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

  loadA1(event: TableLazyLoadEvent): Observable<A1Z> {
    return this.apiService.post(`/A1/TableData`, event).pipe(
      map((data: any) => data),
      catchError(error => throwError(error))
    );
  }

  getById(a1Id: string): Observable<ApiResult<A1Z>> {
    return this.apiService.getById(`/A1/${a1Id}`).pipe(
      map((data: any) => data),
      catchError(error => throwError(error))
    );
  }

  save(a1: A1Z): Observable<ApiResult<A1Z>> {
    return this.apiService.post<ApiResult<A1Z>, A1Z>(`/A1`, a1).pipe(
      map(data => data),
      catchError(error => throwError(error))
    );
  }
  update(a1: A1Z): Observable<ApiResult<A1Z>> {
    return this.apiService.put<ApiResult<A1Z>, A1Z>(`/A1`, a1).pipe(
      map(data => data),
      catchError(error => throwError(error))
    );
  }

  delete(a1: number): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<A1Z>>(`/A1/${a1}`).pipe(
      map((data: any) => data),
      catchError(error => throwError(error))
    );
  }
}
