import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';

import {
  ExamQuestionScore,
  ExamQuestionScoreCreateUpdateMultipleCommand,
} from '@msh/shared/domain-models';
import { TableLazyLoadEvent } from 'primeng/table';

@Injectable({
  providedIn: 'root',
})
export class ExamQuestionScoreService {
  constructor(private apiService: APIService) {}

  loadExamQuestionScores($event: TableLazyLoadEvent): Observable<any> {
    return this.apiService.post(`/ExamQuestionScore/TableData`, $event);
  }

  loadExamQuestionScoresByTotalId(id: any): Observable<any> {
    if (!id) {
      return of({ data: [] });
    }
    return this.apiService.get(`/ExamQuestionScore/ForTotalId/${id}`);
  }

  getExamQuestionScoreById(examQuestionId: number): Observable<any> {
    return this.apiService.get(`/ExamQuestionScore/${examQuestionId}`);
  }

  save(examScore: ExamQuestionScore): Observable<ApiResult<ExamQuestionScore>> {
    return this.apiService.post<
      ApiResult<ExamQuestionScore>,
      ExamQuestionScore
    >(`/ExamQuestionScores`, examScore);
  }

  createOrUpdateMultiple(
    command: ExamQuestionScoreCreateUpdateMultipleCommand
  ): Observable<ApiResult<ExamQuestionScore>> {
    return this.apiService.post<
      ApiResult<ExamQuestionScoreCreateUpdateMultipleCommand>,
      ExamQuestionScore
    >(`/ExamQuestionScore/CreateOrUpdateMultiple`, command);
  }

  update(
    examScore: ExamQuestionScore
  ): Observable<ApiResult<ExamQuestionScore>> {
    return this.apiService.post<
      ApiResult<ExamQuestionScore>,
      ExamQuestionScore
    >(`/ExamQuestionScore/Update`, examScore);
  }

  delete(examQuestionScoreId: any): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<ExamQuestionScore>>(
      `/ExamQuestionScore/${examQuestionScoreId}`
    );
  }
}
