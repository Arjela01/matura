import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';

import {
  CreateOrUpdateMultiple,
  ExamQuestionScore,
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

  loadExamQuestionScoresByBarcode(barcode: string): Observable<any> {
    return this.apiService.get(`/ExamQuestionScore/ForBarcode/${barcode}`);
  }

  getExamQuestionScoreById(examQuestionId: number): Observable<any> {
    return this.apiService.get(`/ExamQuestionScore/${examQuestionId}`);
  }

  save(
    examScore: ExamQuestionScore
  ): Observable<ApiResult<ExamQuestionScore>> {
    return this.apiService.post<
      ApiResult<ExamQuestionScore>,
      ExamQuestionScore
    >(`/ExamQuestionScores`, examScore);
  }

  createOrUpdateMultiple(
    examScore: CreateOrUpdateMultiple
  ): Observable<ApiResult<CreateOrUpdateMultiple>> {
    return this.apiService.post<
      ApiResult<CreateOrUpdateMultiple>,
      CreateOrUpdateMultiple
    >(`/ExamQuestionScore/CreateOrUpdateMultiple`, examScore);
  }

  deleteMultiple(
    examScore: CreateOrUpdateMultiple
  ): Observable<ApiResult<CreateOrUpdateMultiple>> {
    return this.apiService.post<
      ApiResult<CreateOrUpdateMultiple>,
      CreateOrUpdateMultiple
    >(`/ExamQuestionScore/DeleteMultiple`, examScore);
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
