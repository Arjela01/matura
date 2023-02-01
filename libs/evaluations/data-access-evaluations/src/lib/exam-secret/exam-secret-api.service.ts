import {Injectable} from '@angular/core';
import { Observable} from 'rxjs';
import {LazyLoadEvent} from "primeng/api";
import {ApiResult} from "@msh/shared/data-access-shared";
import {APIService} from "@msh/shared/util-shared";
import {ExamSecret, ExamSecretTableView} from "@msh/evaluations/domain-evaluations";

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

  delete(examSecretId: string): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<ExamSecret>>(
      `/api/ExamSecrets/${ examSecretId}`
    );
  }

}

