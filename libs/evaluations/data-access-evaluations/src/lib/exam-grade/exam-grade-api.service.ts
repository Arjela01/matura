import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import { APIService } from '@msh/shared/util-shared';
import { ApiResult } from '@msh/shared/data-access-shared';
import { ExamGradeTableView } from '@msh/shared/domain-models';

@Injectable({
  providedIn: 'root',
})
export class ExamGradeApiService {
  constructor(private apiService: APIService) {}

  getById(id: any): Observable<ApiResult<any>> {
    return this.apiService.get<ApiResult<any>>(`/ExamGrade/${id}`);
  }

  loadExamGrades(event: LazyLoadEvent): Observable<ExamGradeTableView> {
    return this.apiService.post(`/ExamGrade/TableData`, event).pipe(
      map((data: any) => data),
      catchError(error => throwError(error))
    );
  }
}
