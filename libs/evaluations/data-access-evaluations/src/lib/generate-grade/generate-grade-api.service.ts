import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import { APIService } from '@msh/shared/util-shared';
import { GenerateGradeTableView } from '@msh/evaluations/domain-evaluations';

@Injectable({
  providedIn: 'root',
})
export class GenerateGradeApiService {
  constructor(private apiService: APIService) {}

  loadGeneratedGrades(
    event: LazyLoadEvent
  ): Observable<GenerateGradeTableView> {
    return this.apiService.post(`/GenerateGrades/TableData`, event).pipe(
      map((data: any) => data),
      catchError(error => throwError(error))
    );
  }
}
