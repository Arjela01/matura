import { Injectable } from '@angular/core';
import {
  ExamSubject,
  ExamSubjectTableView,
} from '@msh/configurations/domain-configurations';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExamSubjectApiService {
  constructor(private apiService: APIService) {}

  loadExamSubjects(event: LazyLoadEvent): Observable<ExamSubjectTableView> {
    return this.apiService.post(`//TableData`, event);
  }

  save(examSubject: ExamSubject): Observable<ApiResult<ExamSubject>> {
    return this.apiService.post<ApiResult<ExamSubject>, ExamSubject>(
      `/HighSchool`,
      examSubject
    );
  }

  update(examSubject: ExamSubject): Observable<ApiResult<ExamSubject>> {
    return this.apiService.put<ApiResult<ExamSubject>, ExamSubject>(
      `/HighSchool`,
      examSubject
    );
  }

  delete(examSubjectId: number): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<ExamSubject>>(
      `/HighSchool/${examSubjectId}`
    );
  }
}
