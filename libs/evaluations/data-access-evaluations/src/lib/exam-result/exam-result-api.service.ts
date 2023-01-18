import {Injectable} from '@angular/core';
import { Observable} from 'rxjs';
import {ExamResult, ExamResultTableView} from "@msh/evaluations/domain-evaluations";
import {LazyLoadEvent} from "primeng/api";
import {ApiResult} from "@msh/shared/data-access-shared";
import {APIService} from "@msh/shared/util-shared";

@Injectable({
  providedIn: 'root',
})
export class ExamResultApiService {
  constructor(private apiService: APIService) {
  }


  loadExamResults(event: LazyLoadEvent): Observable<ExamResultTableView> {
    return this.apiService.post(`/api/ExamScores/TableData`, event);
  }

  save(examResult: ExamResult): Observable<ApiResult<ExamResult>> {
    return this.apiService.post<ApiResult<ExamResult>, ExamResult>(
      `/api/ExamScores`,
      examResult
    );
  }

  update(examResult: ExamResult): Observable<ApiResult<ExamResult>> {
    return this.apiService.put<ApiResult<ExamResult>, ExamResult>(
      `/api/ExamScores`,
      examResult
    );
  }

  delete(examResultId: number): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<ExamResult>>(
      `/api/ExamScores/${ examResultId}`
    );
  }
}

