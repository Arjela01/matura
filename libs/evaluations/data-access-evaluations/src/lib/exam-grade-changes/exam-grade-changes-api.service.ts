import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TableLazyLoadEvent } from 'primeng/table';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import {
  ExamGradeChange,
  ExamGradeChangeView,
  ExamSecret,
  ExamSecretTableView,
} from '@msh/shared/domain-models';

@Injectable({
  providedIn: 'root',
})
export class ExamGradeChangesApiService {
  constructor(private apiService: APIService) {}

  loadData(
    event: TableLazyLoadEvent,
    examGradeId: string
  ): Observable<ExamGradeChangeView> {
    return this.apiService.post(
      `/ExamGradeChange/ForExamGradeId/${examGradeId}`,
      event
    );
  }

  save(
    examGradeChange: ExamGradeChange
  ): Observable<ApiResult<ExamGradeChange>> {
    return this.apiService.post<ApiResult<ExamGradeChange>, ExamGradeChange>(
      `/ExamGradeChange`,
      examGradeChange
    );
  }

  getExamGradeChangeType(
    academicYearId?: number,
    id?: string
  ): Observable<ApiResult<DropdownModel<string>[]>> {
    const query = {
      academicYearId,
      id,
    };
    return this.apiService.post(`/ExamGradeChangeType/DropdownList`, query);
  }
}
