import { Injectable } from '@angular/core';
import { ApiResult } from '@msh/shared/data-access-shared';
import {
  ConfirmDiplomaException,
  ExamGrade,
  FileImport,
  Student,
  StudentTableView,
} from '@msh/shared/domain-models';
import { APIService } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
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
    event: TableLazyLoadEvent,
    params = {}
  ): Observable<StudentTableView> {
    return this.apiService.postWithParams(`/Student/TableData`, event, params);
  }

  loadStudentsForAssignments(
    event: TableLazyLoadEvent,
    params = {}
  ): Observable<StudentTableView> {
    return this.apiService.postWithParams(
      `/Student/TableDataAssigment`,
      event,
      params
    );
  }

  loadStudentsForA1A1Z(
    event: TableLazyLoadEvent,
    params = {}
  ): Observable<StudentTableView> {
    return this.apiService.postWithParams(
      `/Student/TableDataForA1A1Z`,
      event,
      params
    );
  }

  save(student: Student): Observable<ApiResult<Student>> {
    return this.apiService.post<ApiResult<Student>, Student>(
      `/Student`,
      student
    );
  }

  update(student: Student): Observable<ApiResult<Student>> {
    return this.apiService.post<ApiResult<Student>, Student>(
      `/Student/Update`,
      student
    );
  }

  delete(studentId: number): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<Student>>(`/Student/${studentId}`);
  }
  confirmException(
    id: string,
    isConfirmed?: boolean
  ): Observable<ApiResult<Student>> {
    return this.apiService.post<ApiResult<Student>, ConfirmDiplomaException>(
      '/Student/SetConfirm',
      {
        id: id,
        isConfirmed: !isConfirmed,
      }
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

  getGradesForStudentsById(
    id: string,
    academicYearId: number
  ): Observable<ApiResult<ExamGrade[]>> {
    const url = `/Student/GradeDetail?id=${id}&academicYearId=${academicYearId}`;
    return this.apiService.get<ApiResult<ExamGrade[]>>(url);
  }
}
