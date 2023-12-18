import { Injectable } from '@angular/core';
import { APIService } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import {
  ExamGradeRequestModel,
  ManualExamGradeView,
} from '@msh/shared/domain-models';
import { Observable } from 'rxjs';
import { ApiResult } from '@msh/shared/data-access-shared';
import { ManualExamGradeModel } from '@msh/shared/domain-models';

@Injectable({ providedIn: 'root' })
export class ManualExamGradeService {
  constructor(private apiService: APIService) {}

  load(event: TableLazyLoadEvent): Observable<ManualExamGradeView> {
    return this.apiService.post('/ManualExamGrades/TableData', event);
  }
  getByIdCard(idCard: string): Observable<ManualExamGradeView> {
    return this.apiService.get(`/ManualExamGrades/GetByIdCard/${idCard}`);
  }
  save(
    manualExamGrade: ManualExamGradeModel
  ): Observable<ApiResult<ExamGradeRequestModel>> {
    return this.apiService.post('/ManualExamGrades', manualExamGrade);
  }
  update(
    manualExamGrade: ManualExamGradeModel
  ): Observable<ApiResult<ManualExamGradeModel>> {
    return this.apiService.post('/ManualExamGrades/Update', manualExamGrade);
  }

  delete(manualExamGradeId: string) {
    return this.apiService.delete<ApiResult<ManualExamGradeModel>>(
      `/ManualExamGrades/${manualExamGradeId}`
    );
  }
}
