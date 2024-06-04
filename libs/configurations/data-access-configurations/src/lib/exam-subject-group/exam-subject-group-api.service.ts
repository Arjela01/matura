import { Injectable } from '@angular/core';
import { ApiResult } from '@msh/shared/data-access-shared';
import {
  ExamSubjectGroup,
  ExamSubjectGroupView,
} from '@msh/shared/domain-models';
import { APIService } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExamSubjectGroupApiService {
  constructor(private apiService: APIService) {}

  loadExamSubjects(
    event: TableLazyLoadEvent
  ): Observable<ExamSubjectGroupView> {
    return this.apiService.post(`/ExamSubjectGroup/TableData`, event);
  }

  save(examSubject: ExamSubjectGroup): Observable<ApiResult<ExamSubjectGroup>> {
    return this.apiService.post<ApiResult<ExamSubjectGroup>, ExamSubjectGroup>(
      `/ExamSubjectGroup`,
      examSubject
    );
  }

  update(
    examSubject: ExamSubjectGroup
  ): Observable<ApiResult<ExamSubjectGroup>> {
    return this.apiService.post<ApiResult<ExamSubjectGroup>, ExamSubjectGroup>(
      `/ExamSubjectGroup/Update`,
      examSubject
    );
  }

  delete(examSubjectId: string): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<ExamSubjectGroup>>(
      `/ExamSubjectGroup/${examSubjectId}`
    );
  }
}
