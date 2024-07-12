import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  FailingStudent,
  FailingStudentTableView,
} from '@msh/applications/domain-application';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';

import { TableLazyLoadEvent } from 'primeng/table';
import { Observable } from 'rxjs';
import {
  DiplomaRequest,
  DiplomaRequestTableView,
} from '@msh/shared/domain-models';

@Injectable({
  providedIn: 'root',
})
export class DiplomaRequestApiService {
  constructor(private apiService: APIService) {}

  loadDiplomaRequests(
    event: TableLazyLoadEvent
  ): Observable<DiplomaRequestTableView> {
    return this.apiService.post('/DiplomaRequest/TableData', event);
  }

  delete(id: string): Observable<ApiResult<DiplomaRequest>> {
    return this.apiService.delete<ApiResult<DiplomaRequest>>(
      `/DiplomaRequest/${id}`
    );
  }

  getOne(id: string): Observable<ApiResult<DiplomaRequest>> {
    return this.apiService.get(`/DiplomaRequest/GetById/${id}`);
  }

  update(
    diplomaRequest: DiplomaRequest
  ): Observable<ApiResult<DiplomaRequest>> {
    return this.apiService.post<ApiResult<DiplomaRequest>, DiplomaRequest>(
      `/DiplomaRequest/Update`,
      diplomaRequest
    );
  }

  save(diplomaRequest: DiplomaRequest): Observable<ApiResult<DiplomaRequest>> {
    return this.apiService.post<ApiResult<DiplomaRequest>, DiplomaRequest>(
      '/DiplomaRequest',
      diplomaRequest
    );
  }

  sendToEAlbania(id: string): Observable<any> {
    return this.apiService.get(`/DiplomaRequest/SendToEalbania/${id}`);
  }

  print(id: string): Observable<any> {
    return this.apiService.get(`/DiplomaRequest/Print/${id}`,
      new HttpParams(),
      'blob');
  }


  printSealed(id: string): Observable<any> {
    return this.apiService.get(`/DiplomaRequest/PrintSealed/${id}`,
      new HttpParams(),
      'blob');
  }
}
