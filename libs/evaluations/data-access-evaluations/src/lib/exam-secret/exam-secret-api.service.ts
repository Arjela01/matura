import {Injectable} from '@angular/core';
import {catchError, map, Observable, shareReplay, throwError} from 'rxjs';
import {LazyLoadEvent} from "primeng/api";
import {ApiResult} from "@msh/shared/data-access-shared";
import {APIService} from "@msh/shared/util-shared";
import {ExamSecret, ExamSecretTableView, FileImport} from "@msh/evaluations/domain-evaluations";
import {untilDestroyed} from "@ngneat/until-destroy";
import {A1Z} from "@msh/applications/domain-applications";

@Injectable({
  providedIn: 'root',
})
export class ExamSecretApiService {
  constructor(private apiService: APIService) {
  }


  loadExamSecrets(event: LazyLoadEvent): Observable<ExamSecretTableView> {
    return this.apiService.post(`/api/ExamSecrets/TableData`, event);
  }

  save(examSecret: ExamSecret): Observable<ApiResult<ExamSecret>> {
    return this.apiService.post<ApiResult<ExamSecret>, ExamSecret>(
      `/api/ExamSecrets`,
      examSecret
    );
  }

  update(examSecret: ExamSecret): Observable<ApiResult<ExamSecret>> {
    return this.apiService.put<ApiResult<ExamSecret>, ExamSecret>(
      `/api/ExamSecrets`,
      examSecret
    );
  }

  getExamSecret(id: number): Observable<ApiResult<ExamSecret>> {
    return this.apiService.get(`/ExamSecret/${id}`);
  }

  delete(examSecretId: string): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<ExamSecret>>(
      `/api/ExamSecrets/${ examSecretId}`
    );
  }

  uploadExcelFile(
    base64: string | ArrayBuffer | null
  ): Observable<ApiResult<unknown>> {
    return this.apiService
      .post<ApiResult<FileImport>, FileImport>('/api/ExamSecrets/Import', {
        file: base64,
      })
      .pipe(
        map(data => data),
        catchError(error => throwError(error)),
        shareReplay()
      );
  }
}

