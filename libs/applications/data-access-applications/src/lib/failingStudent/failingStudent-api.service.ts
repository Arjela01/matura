import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  FailingStudent,
  FailingStudentTableView,
} from '@msh/applications/domain-application';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';

import { TableLazyLoadEvent } from 'primeng/table';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FailingStudentApiService {
  constructor(private http: HttpClient, private apiservice: APIService) {}

  loadFailingStudents(
    event: TableLazyLoadEvent
  ): Observable<FailingStudentTableView> {
    return this.apiservice.post('/FailingStudents/TableData', event);
  }

  loadStudentsToFail(
    event: TableLazyLoadEvent
  ): Observable<FailingStudentTableView> {
    return this.apiservice.post(
      '/FailingStudents/TableDataForStudentsOnly',
      event
    );
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
    failingStudent: FailingStudent
  ): Observable<ApiResult<FailingStudent>> {
    return this.apiservice.post<ApiResult<FailingStudent>, FailingStudent>(
      `/FailingStudents/Update`,
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
