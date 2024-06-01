import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { TableLazyLoadEvent } from 'primeng/table';
import { APIService } from '@msh/shared/util-shared';
import {
  AnalyticScoresWithoutTotalModelView, ExamQuestionScoreTotal, ExamQuestionScoreTotalView,
  TotalAnalyticScoresMismatchModelView,
} from '@msh/shared/domain-models';
import { ApiResult } from '@msh/shared/data-access-shared';

@Injectable({
  providedIn: 'root',
})
export class ExamQuestionScoreTotalsService {
  constructor(private apiService: APIService) {}

  loadTableData(
    event: TableLazyLoadEvent | null
  ): Observable<ExamQuestionScoreTotalView> {
    return this.apiService
      .post(`/ExamQuestionScoreTotal/TableData`, event)
      .pipe(
        map((data: any) => data),
        catchError(error => throwError(error))
      );
  }

  delete(
    id: any
  ): Observable<any> {
    return this.apiService
      .delete(`/ExamQuestionScoreTotal/Delete/${id}`);
  }

  loadData(
    event: TableLazyLoadEvent
  ): Observable<AnalyticScoresWithoutTotalModelView> {
    return this.apiService
      .post(`/ExamQuestionScore/AnalyticScoresWithoutTotal`, event)
      .pipe(
        map((data: any) => data),
        catchError(error => throwError(error))
      );
  }

  loadTotalAnalyticMismatchData(
    event: TableLazyLoadEvent
  ): Observable<TotalAnalyticScoresMismatchModelView> {
    return this.apiService
      .post(`/ExamQuestionScore/TotalAnalyticScoresMismatch`, event)
      .pipe(
        map((data: any) => data),
        catchError(error => throwError(error))
      );
  }

  getById(id: string): Observable<ApiResult<ExamQuestionScoreTotal>> {
    return this.apiService
      .get(`/ExamQuestionScoreTotal/GetById/${id}`);
  }
}
