import {Injectable} from '@angular/core';
import { Observable} from 'rxjs';
import {LazyLoadEvent} from "primeng/api";
import {ApiResult} from "@msh/shared/data-access-shared";
import {APIService} from "@msh/shared/util-shared";
import {ExamScore, ExamScoreTableView} from "@msh/evaluations/domain-evaluations";

@Injectable({
  providedIn: 'root',
})
export class ExamScoreApiService {
  constructor(private apiService: APIService) {
  }


  loadExamScores(event: LazyLoadEvent): Observable<ExamScoreTableView> {
    return this.apiService.post(`/api/ExamScores/TableData`, event);
  }

  save(examScore: ExamScore): Observable<ApiResult<ExamScore>> {
    return this.apiService.post<ApiResult<ExamScore>, ExamScore>(
      `/api/ExamScores`,
      examScore
    );
  }

  update(examScore: ExamScore): Observable<ApiResult<ExamScore>> {
    return this.apiService.put<ApiResult<ExamScore>, ExamScore>(
      `/api/ExamScores`,
      examScore
    );
  }

  delete(examScoreId: number): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<ExamScore>>(
      `/api/ExamScores/${ examScoreId}`
    );
  }
}

