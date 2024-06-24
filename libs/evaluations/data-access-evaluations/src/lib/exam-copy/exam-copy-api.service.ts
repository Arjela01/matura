import { Injectable } from '@angular/core';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import {
  ExamCopy,
  ExamCopyTableView,
  ExamCopyUpdate,
} from '@msh/shared/domain-models';

@Injectable({
  providedIn: 'root',
})
export class ExamCopyApiService {
  constructor(private apiService: APIService) {}

  loadExamCopies(event: TableLazyLoadEvent): Observable<ExamCopyTableView> {
    return this.apiService.post(`/ExamCopyRequest/TableData`, event);
  }

  update(body: ExamCopyUpdate): Observable<ApiResult<ExamCopyUpdate>> {
    return this.apiService.post(`/ExamCopyRequest/Update`, body);
  }

  getById(applicationId: string): Observable<ApiResult<ExamCopy>> {
    return this.apiService.get(
      `/ExamCopyRequest/GetByApplicationId/${applicationId}`
    );
  }
  exportTemplate(): Observable<ApiResult<unknown>> {
    return this.apiService.get<any>(
      `/ExamCopyRequest/Export`,
      new HttpParams(),
      'blob'
    );
  }
}
