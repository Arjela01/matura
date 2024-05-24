import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TableLazyLoadEvent } from 'primeng/table';
import { ApiResult } from '@msh/shared/data-access-shared';
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

  loadData(event: TableLazyLoadEvent): Observable<ExamGradeChangeView> {
    return this.apiService.post(`/ExamGradeChange/TableData`, event);
  }

  save(
    examGradeChange: ExamGradeChange
  ): Observable<ApiResult<ExamGradeChange>> {
    return this.apiService.post<ApiResult<ExamGradeChange>, ExamGradeChange>(
      `/ExamGradeChange`,
      examGradeChange
    );
  }
}
