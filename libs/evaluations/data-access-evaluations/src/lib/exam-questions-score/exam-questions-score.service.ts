import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';

import {
  CreateOrUpdateMultiple,
  ExamQuestionScoreModel,
} from '@msh/shared/domain-models';
import { TableLazyLoadEvent } from 'primeng/table';

@Injectable({
  providedIn: 'root',
})
export class ExamQuestionScoreService {
  constructor(private apiService: APIService) {}

  loadExamQuestionScores($event: TableLazyLoadEvent): Observable<any> {
    return this.apiService.post(`/ExamQuestionScores/TableData`, $event);
  }

  loadExamQuestionScoresByBarcode(barcode: string): Observable<any> {
    return this.apiService.get(`/ExamQuestionScores/ForBarcode/${barcode}`);
  }

  getExamQuestionScoreById(examQuestionId: number): Observable<any> {
    return this.apiService.get(`/ExamQuestionScores/${examQuestionId}`);
  }

  save(
    examScore: ExamQuestionScoreModel
  ): Observable<ApiResult<ExamQuestionScoreModel>> {
    return this.apiService.post<
      ApiResult<ExamQuestionScoreModel>,
      ExamQuestionScoreModel
    >(`/ExamQuestionScores`, examScore);
  }

  createOrUpdateMultiple(
    examScore: CreateOrUpdateMultiple
  ): Observable<ApiResult<CreateOrUpdateMultiple>> {
    return this.apiService.post<
      ApiResult<CreateOrUpdateMultiple>,
      CreateOrUpdateMultiple
    >(`/ExamQuestionScores/CreateOrUpdateMultiple`, examScore);
  }

  deleteMultiple(
    examScore: CreateOrUpdateMultiple
  ): Observable<ApiResult<CreateOrUpdateMultiple>> {
    return this.apiService.post<
      ApiResult<CreateOrUpdateMultiple>,
      CreateOrUpdateMultiple
    >(`/ExamQuestionScores/DeleteMultiple`, examScore);
  }

  update(
    examScore: ExamQuestionScoreModel
  ): Observable<ApiResult<ExamQuestionScoreModel>> {
    return this.apiService.post<
      ApiResult<ExamQuestionScoreModel>,
      ExamQuestionScoreModel
    >(`/ExamQuestionScores/Update`, examScore);
  }

  delete(examQuestionScoreId: any): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<ExamQuestionScoreModel>>(
      `/ExamQuestionScores/${examQuestionScoreId}`
    );
  }
}
