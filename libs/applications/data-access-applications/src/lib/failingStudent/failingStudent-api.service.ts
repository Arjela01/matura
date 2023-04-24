import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  FailingStudent,
  FailingStudentTableView,
} from '@msh/applications/domain-application';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FailingStudentApiService {
  constructor(private http: HttpClient, private apiservice: APIService) {}

  loadFailingStudents(
    event: LazyLoadEvent
  ): Observable<FailingStudentTableView> {
    return this.apiservice.post('/FailingStudents/TableData', event);
  }

  delete(id: string): Observable<ApiResult<unknown>> {
    return this.apiservice.delete<ApiResult<FailingStudent>>(
      `/FailingStudents/${id}`
    );
  }

  getOne(id: string): Observable<ApiResult<FailingStudent>> {
    return this.apiservice.get(`/FailingStudents/${id}`);
  }

  update(
    failingStudent: any
  ): Observable<ApiResult<FailingStudent>> {
    return this.apiservice.put<ApiResult<FailingStudent>, FailingStudent>(
      `/FailingStudents`,
      failingStudent
    );
  }

  save(failingStudent: FailingStudent): Observable<ApiResult<FailingStudent>> {
    return this.apiservice.post<ApiResult<FailingStudent>, FailingStudent>(
      '/FailingStudents',
      failingStudent
    );
  }
}
