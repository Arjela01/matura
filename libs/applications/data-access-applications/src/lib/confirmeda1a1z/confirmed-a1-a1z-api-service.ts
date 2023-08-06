import { Injectable } from '@angular/core';
import { Student, StudentTableView } from '@msh/shared/domain-models';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfirmedA1A1ZService {
  constructor(private apiService: APIService) {}

  approveA1A1Z(studentId: string): Observable<ApiResult<Student>> {
    return this.apiService
      .post<ApiResult<Student>, Student>(
        `/A1A1ZConfirmation/Confirm?studentId=${studentId}`
      )
      .pipe(
        map((data: any) => data),
        catchError(error => throwError(error))
      );
  }
  loadStudentToConfirm(
    event: TableLazyLoadEvent
  ): Observable<StudentTableView> {
    return this.apiService.post(`/A1A1ZConfirmation/TableData`, event);
  }
  refuseA1A1Z(studentId: string): Observable<ApiResult<Student>> {
    return this.apiService
      .post<ApiResult<Student>, Student>(
        `/A1A1ZConfirmation/Refuse?studentId=${studentId}`
      )
      .pipe(
        map((data: any) => data),
        catchError(error => throwError(error))
      );
  }
}
