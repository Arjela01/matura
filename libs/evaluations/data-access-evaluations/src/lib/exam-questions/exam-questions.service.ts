import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';

import { TableLazyLoadEvent } from 'primeng/table';
import { ExamQuestionTableView } from '@msh/shared/domain-models';
import { ExamQuestionModel } from '@msh/shared/domain-models';

@Injectable({
  providedIn: 'root',
})
export class ExamQuestionsService {
  constructor(private apiService: APIService) {}

  loadData(event: TableLazyLoadEvent): Observable<ExamQuestionTableView> {
    return this.apiService.post(`/ExamQuestion/TableData`, event);
  }
  save(
    examQuestion: ExamQuestionModel
  ): Observable<ApiResult<ExamQuestionModel>> {
    return this.apiService.post<
      ApiResult<ExamQuestionModel>,
      ExamQuestionModel
    >(`/ExamQuestion`, examQuestion);
  }

  update(
    examQuestion: ExamQuestionModel
  ): Observable<ApiResult<ExamQuestionModel>> {
    return this.apiService.post<
      ApiResult<ExamQuestionModel>,
      ExamQuestionModel
    >(`/ExamQuestion/Update`, examQuestion);
  }

  delete(examQuestionId: any): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<ExamQuestionModel>>(
      `/ExamQuestion/${examQuestionId}`
    );
  }
  getExamQuestionsByExamVariantId(examVariantId: any): Observable<any> {
    return this.apiService.get(`/ExamQuestion/ByExamVariant/${examVariantId}`);
  }
}
