import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { TableLazyLoadEvent } from 'primeng/table';
import { APIService } from '@msh/shared/util-shared';
import {
  AnalyticScoresWithoutTotalModelView,
  TotalAnalyticScoresMismatchModelView,
} from '@msh/shared/domain-models';

@Injectable({
  providedIn: 'root',
})
export class ExamQuestionScoreTotalsService {
  constructor(private apiService: APIService) {}

  loadTableData(
    event: TableLazyLoadEvent | null
  ): Observable<AnalyticScoresWithoutTotalModelView> {
    return this.apiService
      .post(`/ExamQuestionScoreTotal/TableData`, event)
      .pipe(
        map((data: any) => data),
        catchError(error => throwError(error))
      );
  }

  delete(
    id: any
  ): Observable<AnalyticScoresWithoutTotalModelView> {
    return this.apiService
      .delete(`/ExamQuestionScoreTotal/Delete/${id}`)
      .pipe(
        map((data: any) => data),
        catchError(error => throwError(error))
      );
  }

  loadData(
    event: TableLazyLoadEvent
  ): Observable<AnalyticScoresWithoutTotalModelView> {
    return this.apiService
      .post(`/ExamQuestionScores/AnalyticScoresWithoutTotal`, event)
      .pipe(
        map((data: any) => data),
        catchError(error => throwError(error))
      );
  }

  loadTotalAnalyticMismatchData(
    event: TableLazyLoadEvent
  ): Observable<TotalAnalyticScoresMismatchModelView> {
    return this.apiService
      .post(`/ExamQuestionScores/TotalAnalyticScoresMismatch`, event)
      .pipe(
        map((data: any) => data),
        catchError(error => throwError(error))
      );
  }

}
