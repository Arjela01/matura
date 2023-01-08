import {Injectable} from '@angular/core';
import { Observable} from 'rxjs';
import {LazyLoadEvent} from "primeng/api";
import {ApiResult} from "@msh/shared/data-access-shared";
import {APIService} from "@msh/shared/util-shared";
import {ExamType, ExamTypeTableView} from "@msh/configurations/domain-configurations";

@Injectable({
  providedIn: 'root',
})
export class ExamTypeApiService {
  constructor( private apiService: APIService) {
  }

  loadExamTypes(event: LazyLoadEvent): Observable<ExamTypeTableView> {
    return this.apiService.post(`/ /`, event);
  }

  save(examType: ExamType): Observable<ApiResult<ExamType>> {
    return this.apiService.post<ApiResult<ExamType>, ExamType>(
      `/`,
      examType
    );
  }

  update(examType: ExamType): Observable<ApiResult<ExamType>> {
    return this.apiService.put<ApiResult<ExamType>, ExamType>(
      `/ `,
      examType
    );
  }

  delete(examTypeId: number): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<ExamType>>(
      `//${ examTypeId}`
    );
  }
}
