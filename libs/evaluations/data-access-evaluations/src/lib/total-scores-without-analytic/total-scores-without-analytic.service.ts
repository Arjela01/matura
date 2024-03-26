import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { TableLazyLoadEvent } from 'primeng/table';
import { APIService } from '@msh/shared/util-shared';
import { TotalScoresWithoutAnalyticModelView } from '@msh/shared/domain-models';

@Injectable({
  providedIn: 'root',
})
export class TotalScoresWithoutAnalyticService {
  constructor(private apiService: APIService) {}

  loadData(
    event: TableLazyLoadEvent
  ): Observable<TotalScoresWithoutAnalyticModelView> {
    return this.apiService
      .post(`/ExamQuestionScores/TotalPointsWithoutAnlytic`, event)
      .pipe(
        map((data: any) => data),
        catchError(error => throwError(error))
      );
  }
}
