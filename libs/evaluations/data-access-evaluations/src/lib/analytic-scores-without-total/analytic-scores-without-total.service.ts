import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { TableLazyLoadEvent } from 'primeng/table';
import { APIService } from '@msh/shared/util-shared';
import {
  AnalyticScoresWithoutTotalModel,
  AnalyticScoresWithoutTotalModelView,
  TotalAnalyticScoresMismatchModelView,
} from '@msh/shared/domain-models';

@Injectable({
  providedIn: 'root',
})
export class AnalyticScoresWithoutTotalService {
  constructor(private apiService: APIService) {}

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
  loadAnalyticScoresData(
    event: TableLazyLoadEvent
  ): Observable<AnalyticScoresWithoutTotalModelView> {
    return this.apiService
      .post(`/ExamQuestionScores/AnalyticScores`, event)
      .pipe(
        map((data: any) => data),
        catchError(error => throwError(error))
      );
  }
}
