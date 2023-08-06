import { Injectable } from '@angular/core';
import { catchError, map, Observable, shareReplay, throwError } from 'rxjs';
import { TableLazyLoadEvent } from 'primeng/table';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { HttpParams } from '@angular/common/http';
import {
  ExamSecret,
  ExamSecretTableView,
  FileImport,
} from '@msh/shared/domain-models';

@Injectable({
  providedIn: 'root',
})
export class ExamSecretApiService {
  constructor(private apiService: APIService) {}

  loadExamSecrets(event: TableLazyLoadEvent): Observable<ExamSecretTableView> {
    return this.apiService.post(`/ExamSecrets/TableData`, event);
  }

  loadExamSecretFolderMismatch(event: TableLazyLoadEvent): Observable<ExamSecretTableView> {
    return this.apiService.post(`/ExamSecrets/FolderMismatch`, event);
  }

  save(examSecret: ExamSecret): Observable<ApiResult<ExamSecret>> {
    return this.apiService.post<ApiResult<ExamSecret>, ExamSecret>(
      `/ExamSecrets`,
      examSecret
    );
  }

  update(examSecret: ExamSecret): Observable<ApiResult<ExamSecret>> {
    return this.apiService.put<ApiResult<ExamSecret>, ExamSecret>(
      `/ExamSecrets`,
      examSecret
    );
  }

  getExamSecret(id: string): Observable<ApiResult<ExamSecret>> {
    return this.apiService.get(`/ExamSecrets/${id}`);
  }

  delete(examSecretId?: string): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<ExamSecret>>(
      `/ExamSecrets/${examSecretId}`
    );
  }

  uploadExcelFile(
    base64: string | ArrayBuffer | null
  ): Observable<ApiResult<unknown>> {
    return this.apiService
      .post<ApiResult<FileImport>, FileImport>('/ExamSecrets/Import', {
        file: base64,
      })
      .pipe(
        map(data => data),
        catchError(error => throwError(error)),
        shareReplay()
      );
  }

  export(): Observable<ApiResult<unknown>> {
    return this.apiService.get<any>(
      `/ExamSecrets/Export`,
      new HttpParams(),
      'blob'
    );
  }

  exportTemplate(): Observable<ApiResult<unknown>> {
    return this.apiService.get<any>(
      `/ExamSecrets/ExportTemplate`,
      new HttpParams(),
      'blob'
    );
  }

  forExamSubjectId(examSubjectId: string): Observable<ApiResult<ExamSecret[]>> {
    return this.apiService.get(
      `/ExamSecrets/ForExamSubjectId/${examSubjectId}`
    );
  }
}
