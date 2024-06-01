import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { TableLazyLoadEvent } from 'primeng/table';
import { APIService } from '@msh/shared/util-shared';
import {
  ExamQuestionScoreTotal,
  ExamQuestionScoreTotalView,
  ExamScoresView,
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

  delete(id: any): Observable<any> {
    return this.apiService.delete(`/ExamQuestionScoreTotal/Delete/${id}`);
  }

  getExamQuestionTotalsWithoutExamScores(
    event: TableLazyLoadEvent
  ): Observable<ExamQuestionScoreTotalView> {
    return this.apiService
      .post(
        `/ExamQuestionScoreTotal/GetExamQuestionTotalsWithoutExamScores`,
        event
      )
      .pipe(
        map((data: any) => data),
        catchError(error => throwError(error))
      );
  }

  getExamScoresWithoutExamQuestionTotals(
    event: TableLazyLoadEvent
  ): Observable<ExamScoresView> {
    return this.apiService
      .post(
        `/ExamQuestionScoreTotal/GetExamScoresWithoutExamQuestionTotals`,
        event
      )
      .pipe(
        map((data: any) => data),
        catchError(error => throwError(error))
      );
  }

  getExamScoreExamQuestionTotalMismatches(
    event: TableLazyLoadEvent
  ): Observable<TotalAnalyticScoresMismatchModelView> {
    return this.apiService
      .post(
        `/ExamQuestionScoreTotal/GetExamScoreExamQuestionTotalMismatches`,
        event
      )
      .pipe(
        map((data: any) => data),
        catchError(error => throwError(error))
      );
  }

  getById(id: string): Observable<ApiResult<ExamQuestionScoreTotal>> {
    return this.apiService.get(`/ExamQuestionScoreTotal/GetById/${id}`);
  }

  isBarcodeFree(barcode: string | undefined): Observable<ApiResult<boolean>> {
    return this.apiService.get(`/ExamQuestionScoreTotal/IsBarcodeFree/${barcode}`);
  }
}
