import { Injectable } from '@angular/core';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import {Observable} from 'rxjs';
import {Student, StudentTableView} from "@msh/shared/domain-models";

@Injectable({
  providedIn: 'root',
})
export class StudentsApiService {
  constructor(private apiService: APIService) {}

    getById(id: any): Observable<ApiResult<Student>> {
    return this.apiService.get<ApiResult<Student>>(
      `/Student/${id}`);
  }

  loadStudents(event: LazyLoadEvent): Observable<StudentTableView> {
    return this.apiService.post(`/Student/TableData`, event);
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
    return this.apiService.delete<ApiResult<Student>>(
      `/Student/${studentId}`
    );
  }
}
