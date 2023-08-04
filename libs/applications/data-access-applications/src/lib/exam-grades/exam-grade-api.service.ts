import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { APIService } from '@msh/shared/util-shared';
import { ApiResult } from '@msh/shared/data-access-shared';

@Injectable({
  providedIn: 'root',
})
export class ExamGradeApiService {
  constructor(private apiService: APIService) {}

  getById(id: any): Observable<ApiResult<any>> {
    return this.apiService.get<ApiResult<any>>(`/ExamGrade/${id}`);
  }

  forStudentId(id: any, type: string) {
    return this.apiService.get(`/ExamGrade/ForStudentId/${id}/${type}`).pipe(
      map((data: any) => data),
      catchError(error => throwError(error))
    );
  }
}
