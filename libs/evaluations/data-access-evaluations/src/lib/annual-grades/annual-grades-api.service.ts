import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import { APIService } from '@msh/shared/util-shared';
import {AnnualGradesView} from "@msh/evaluations/domain-evaluations";

@Injectable({
  providedIn: 'root',
})
export class AnnualGradesApiService {
  constructor(private apiService: APIService) {}

  loadAnnualGrades(
    event: LazyLoadEvent
  ): Observable<AnnualGradesView> {
    return this.apiService.post(`/ExamGrade/TableData`, event).pipe(
      map((data: any) => data),
      catchError(error => throwError(error))
    );
  }
}
