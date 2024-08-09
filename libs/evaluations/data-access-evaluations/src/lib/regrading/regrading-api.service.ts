import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { TableLazyLoadEvent } from 'primeng/table';
import { APIService } from '@msh/shared/util-shared';
import {
  ExamCopy,
  Regrading,
  RegradingImportCommand,
  RegradingTableView,
  RegradingUpdate,
} from '@msh/shared/domain-models';
import { ApiResult } from '@msh/shared/data-access-shared';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RegradingApiService {
  constructor(private apiService: APIService) {}

  loadExamGrades(event: TableLazyLoadEvent): Observable<RegradingTableView> {
    return this.apiService.post(`/RegradingRequest/TableData`, event).pipe(
      map((data: any) => data),
      catchError(error => throwError(error))
    );
  }

  import(
    command: RegradingImportCommand
  ): Observable<ApiResult<RegradingImportCommand>> {
    return this.apiService.post<
      ApiResult<RegradingImportCommand>,
      RegradingImportCommand
    >(`/RegradingRequest/Import`, command);
  }

  updateStatus(body: Regrading): Observable<ApiResult<Regrading>> {
    return this.apiService.post<ApiResult<Regrading>, Regrading>(
      `/RegradingRequest/Update`,
      body
    );
  }

  exportTemplate(): Observable<ApiResult<unknown>> {
    return this.apiService.get<any>(
      `/RegradingRequest/ExportTemplate`,
      new HttpParams(),
      'blob'
    );
  }
}
