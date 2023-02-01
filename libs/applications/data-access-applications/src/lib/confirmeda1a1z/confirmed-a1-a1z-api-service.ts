import { Injectable } from '@angular/core';
import { Student } from '@msh/configurations/domain-configurations';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
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
