import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { APIService } from '@msh/shared/util-shared';
import { ApiResult } from '@msh/shared/data-access-shared';
import { HttpParams } from '@angular/common/http';
import {
  ApplicationProcessTableView,
  Process,
} from '@msh/shared/domain-models';

@Injectable({
  providedIn: 'root',
})
export class CalculationProcessesApiService {
  constructor(private apiService: APIService) {}

  loadProcessData(
    processType: number
  ): Observable<ApplicationProcessTableView> {
    return this.apiService.get(`/Process/${processType}`).pipe(
      map((data: any) => data),
      catchError(error => throwError(error))
    );
  }

  loadProcess(appProcessType: any): Observable<ApiResult<Process>> {
    return this.apiService
      .post(`/Process`, {
        appProcessType: appProcessType,
        force: true,
      })
      .pipe(
        map((data: any) => data),
        catchError(error => throwError(error))
      );
  }
  export(): Observable<ApiResult<unknown>> {
    return this.apiService.get<any>(
      `/GenerateTableT/ExportTemplate`,
      new HttpParams(),
      'blob'
    );
  }
}
