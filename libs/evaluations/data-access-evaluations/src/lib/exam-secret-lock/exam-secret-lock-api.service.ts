import { Injectable } from '@angular/core';
import { catchError, map, Observable, shareReplay, throwError } from 'rxjs';
import { TableLazyLoadEvent } from 'primeng/table';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { HttpParams } from '@angular/common/http';
import {
  ExamScoreTableView,
  ExamSecret,
  ExamSecretLock,
  ExamSecretLockView,
  ExamSecretTableView,
  FileImport,
} from '@msh/shared/domain-models';

@Injectable({
  providedIn: 'root',
})
export class ExamSecretLockApiService {
  constructor(private apiService: APIService) {}

  loadExamSecretLocksData(): Observable<ExamSecretLockView> {
    return this.apiService.get(`/ExamSecretLocks`);
  }

  save(examSecret: ExamSecretLock): Observable<ApiResult<ExamSecretLock>> {
    return this.apiService.post<ApiResult<ExamSecretLock>, ExamSecretLock>(
      `/ExamSecretLocks`,
      examSecret
    );
  }
}
