import { Injectable } from '@angular/core';
import { ApiResult } from '@msh/shared/data-access-shared';
import {
  ConfirmDiplomaException,
  FileImport,
  Student,
  StudentTableView,
} from '@msh/shared/domain-models';
import { APIService } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { Observable, catchError, map, shareReplay, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentsApiService {
  constructor(private apiService: APIService) {}

  getById(id: any): Observable<ApiResult<Student>> {
    return this.apiService.get<ApiResult<Student>>(`/Student/${id}`);
  }

  loadStudents(
    event: LazyLoadEvent,
    params = {}
  ): Observable<StudentTableView> {
    return this.apiService.postWithParams(`/Student/TableData`, event, params);
  }

  save(student: Student): Observable<ApiResult<Student>> {
    return this.apiService.post<ApiResult<Student>, Student>(
      `/Student`,
      student
    );
  }

  update(student: Student): Observable<ApiResult<Student>> {
    return this.apiService.put<ApiResult<Student>, Student>(
      `/Student`,
      student
    );
  }

  delete(studentId: number): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<Student>>(`/Student/${studentId}`);
  }

  confirmException(exceptedDiploma: {
    isConfirmed: boolean;
    id: any;
  }): Observable<ApiResult<Student>> {
    return this.apiService.post<ApiResult<Student>, ConfirmDiplomaException>(
      '/Student/SetConfirm',
      exceptedDiploma
    );
  }

  uploadExcelFile(
    base64: string | ArrayBuffer | null
  ): Observable<ApiResult<unknown>> {
    return this.apiService
      .post<ApiResult<FileImport>, FileImport>('/Student/Import', {
        file: base64,
      })
      .pipe(
        map(data => data),
        catchError(error => throwError(error)),
        shareReplay()
      );
  }
  getA1A1ZByStudentId(id: string): Observable<ApiResult<any>> {
    return this.apiService.get(`/Student/GetA1A1ZByStudentId/${id}`);
  }
}
