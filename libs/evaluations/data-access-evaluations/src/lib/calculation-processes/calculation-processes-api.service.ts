import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { APIService } from '@msh/shared/util-shared';
import {
  ApplicationProcessTableView,
  Process,
} from '@msh/evaluations/domain-evaluations';

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

  loadProcess(appProcessType: any): Observable<Process> {
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
}
