import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { ExamSecretLock, ExamSecretLockView } from '@msh/shared/domain-models';

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
