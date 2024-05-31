import { Injectable } from '@angular/core';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Student, StudentTableView } from '@msh/shared/domain-models';

@Injectable({
  providedIn: 'root',
})
export class AverageGradeService {
  constructor(private apiService: APIService) {}

  loadData(event: TableLazyLoadEvent): Observable<StudentTableView> {
    return this.apiService.post(`/AverageGrade/TableData`, event).pipe(
      map((data: any) => data),
      catchError(error => throwError(error))
    );
  }

  getById(id: string): Observable<ApiResult<any>> {
    return this.apiService
      .get<ApiResult<Student[]>>(`/AverageGrade/ForStudentId/${id}`)
      .pipe(
        map((data: any) => data),
        catchError(error => throwError(error))
      );
  }
}
