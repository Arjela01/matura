import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import { APIService } from '@msh/shared/util-shared';
import { AnnualGradesView } from '@msh/evaluations/domain-evaluations';
import { ApiResult } from '@msh/shared/data-access-shared';
import { HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class AnnualGradesApiService {
  constructor(private apiService: APIService) {}

  loadAnnualGrades(event: LazyLoadEvent): Observable<AnnualGradesView> {
    return this.apiService.post(`/ExamGrade/TableData`, event).pipe(
      map((data: any) => data),
      catchError(error => throwError(error))
    );
  }

  getAverageGrade(id: any): Observable<ApiResult<any>> {

    return this.apiService
      .get<ApiResult<any>>(`/Ial/${id}`)
      .pipe(
        map((data: any) => data),
        catchError(error => throwError(error))
      );
  }
  export(): Observable<ApiResult<unknown>> {
    return this.apiService.get<any>(``, new HttpParams(), 'blob');
  }
}
