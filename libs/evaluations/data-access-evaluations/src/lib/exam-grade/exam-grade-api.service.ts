import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import { APIService } from '@msh/shared/util-shared';
import {ExamGradeTableView} from "@msh/evaluations/domain-evaluations";

@Injectable({
  providedIn: 'root',
})
export class ExamGradeApiService {
  constructor(private apiService: APIService) {}

  loadAnnualExamGrades(
    event: LazyLoadEvent
  ): Observable<ExamGradeTableView> {
    return this.apiService.post(`/ExamGrade/TableData`, event).pipe(
      map((data: any) => data),
      catchError(error => throwError(error))
    );
  }
}
