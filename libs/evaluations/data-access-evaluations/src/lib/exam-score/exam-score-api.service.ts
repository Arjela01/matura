import {Injectable} from '@angular/core';
import { Observable} from 'rxjs';
import {LazyLoadEvent} from "primeng/api";
import {ApiResult} from "@msh/shared/data-access-shared";
import {APIService} from "@msh/shared/util-shared";
import {ExamScore, ExamScoreTableView} from "@msh/evaluations/domain-evaluations";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class ExamScoreApiService {
  constructor(private apiService: APIService,private http: HttpClient) {
  }


  loadExamScores(event: LazyLoadEvent): Observable<ExamScoreTableView> {
    return this.apiService.post(`/api/ExamScores/TableData`, event);
  }

  loadExamScoresExcel(examScore: ExamScore): Observable<ExamScore> {
    return this.apiService.post(`/api/ExamScores/Import`, examScore);
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
  loadStudentsList(): Observable<any> {
    return this.http.get('assets/demo/data/exam-result.json');
  }
}

