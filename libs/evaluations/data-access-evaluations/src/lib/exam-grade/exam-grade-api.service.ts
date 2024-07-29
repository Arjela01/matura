import { Injectable } from '@angular/core';
import { ApiResult } from '@msh/shared/data-access-shared';
import { ExamGrade, ExamGradeTableView } from '@msh/shared/domain-models';
import { APIService } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExamGradeApiService {
  constructor(private apiService: APIService) {}

  getById(id: any): Observable<ApiResult<any>> {
    return this.apiService.get<ApiResult<any>>(`/ExamGrade/${id}`);
  }

  loadExamGrades(event: TableLazyLoadEvent): Observable<ExamGradeTableView> {
    return this.apiService.post(`/ExamGrade/TableData`, event).pipe(
      map((data: any) => data),
      catchError(error => throwError(error))
    );
  }

  delete(examGradeId: any): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<ExamGrade>>(`/ExamGrade/${examGradeId}`);
  }
}
