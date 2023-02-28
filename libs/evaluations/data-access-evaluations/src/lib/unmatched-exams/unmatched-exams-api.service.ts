import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { APIService } from '@msh/shared/util-shared';
import { ExamScoreTableView } from '@msh/evaluations/domain-evaluations';
import { LazyLoadEvent } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class UnmatchedExamsApiService {
  constructor(private apiService: APIService) {}

  loadUnmatchedExamScores(
    event: LazyLoadEvent
  ): Observable<ExamScoreTableView> {
    return this.apiService.post(`/ExamScores/UnmatchedExams`, event).pipe(
      map((data: any) => data),
      catchError(error => throwError(error))
    );
  }
}
