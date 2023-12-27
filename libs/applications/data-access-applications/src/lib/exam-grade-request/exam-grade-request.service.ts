import { Injectable } from '@angular/core';
import { APIService } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import {
  ExamGradeRequestModel,
  ExamGradeRequestView,
  ExamGradesRequestStatus,
} from '@msh/shared/domain-models';
import { Observable } from 'rxjs';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';

@Injectable({ providedIn: 'root' })
export class ExamGradeRequestService {
  constructor(private apiService: APIService) {}

  loadExamGradeRequest(
    event: TableLazyLoadEvent
  ): Observable<ExamGradeRequestView> {
    return this.apiService.post('/ExamGradesRequest/TableData', event);
  }
  saveExamGradeRequest(
    examGradeRequest: ExamGradeRequestModel
  ): Observable<ApiResult<ExamGradeRequestModel>> {
    return this.apiService.post('/ExamGradesRequest', examGradeRequest);
  }
  updateExamGradeRequest(
    examGradeRequest: ExamGradeRequestModel
  ): Observable<ApiResult<ExamGradeRequestModel>> {
    return this.apiService.post('/ExamGradesRequest/Update', examGradeRequest);
  }

  deleteExamGradeRequest(examGradeRequestId: string) {
    return this.apiService.delete<ApiResult<ExamGradeRequestModel>>(
      `/ExamGradesRequest/${examGradeRequestId}`
    );
  }

  getStatus(): Observable<ApiResult<DropdownModel<string>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<string>[]>>(
      '/ExamGradesRequestStatus'
    );
  }
  getExamGradeRequestById(id: string): Observable<ApiResult<any>> {
    return this.apiService.get<ApiResult<any>>(`/ExamGradesRequest/${id}`);
  }
}
