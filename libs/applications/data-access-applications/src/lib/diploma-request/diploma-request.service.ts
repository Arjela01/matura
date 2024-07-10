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
import {
  DiplomaRequest,
  DiplomaRequestTableView,
} from '@msh/shared/domain-models';

@Injectable({
  providedIn: 'root',
})
export class DiplomaRequestService {
  constructor(private apiservice: APIService) {}

  loadDiplomaRequests(
    event: TableLazyLoadEvent
  ): Observable<DiplomaRequestTableView> {
    return this.apiservice.post('/DiplomaRequest/TableData', event);
  }

  delete(id: string): Observable<ApiResult<DiplomaRequest>> {
    return this.apiservice.delete<ApiResult<DiplomaRequest>>(
      `/DiplomaRequest/${id}`
    );
  }

  getOne(id: string): Observable<ApiResult<DiplomaRequest>> {
    return this.apiservice.get(`/DiplomaRequest/${id}`);
  }

  update(
    diplomaRequest: DiplomaRequest
  ): Observable<ApiResult<DiplomaRequest>> {
    return this.apiservice.post<ApiResult<DiplomaRequest>, DiplomaRequest>(
      `/DiplomaRequest/Update`,
      diplomaRequest
    );
  }

  save(diplomaRequest: DiplomaRequest): Observable<ApiResult<DiplomaRequest>> {
    return this.apiservice.post<ApiResult<DiplomaRequest>, DiplomaRequest>(
      '/DiplomaRequest',
      diplomaRequest
    );
  }

  sendToEAlbania(id: string): Observable<any> {
    return this.apiservice.post(`/DiplomaRequest/SendToEalbania`, id);
  }
}
