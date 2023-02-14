import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import { APIService } from '@msh/shared/util-shared';
import { CalculateGradeTableView } from '@msh/evaluations/domain-evaluations';

@Injectable({
  providedIn: 'root',
})
export class CalculateGradeApiService {
  constructor(private apiService: APIService) {}

  loadCalculatedGrades(
    event: LazyLoadEvent
  ): Observable<CalculateGradeTableView> {
    return this.apiService.post(`/CalculateGrades`, event).pipe(
      map((data: any) => data),
      catchError(error => throwError(error))
    );
  }
}
