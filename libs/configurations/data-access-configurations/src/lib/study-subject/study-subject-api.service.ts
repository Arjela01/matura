import { Injectable } from '@angular/core';
import { StudySubject, StudySubjectTableView } from '@msh/shared/domain-models';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudySubjectApiService {
  constructor(private apiService: APIService) {}

  loadStudySubjects(
    event: TableLazyLoadEvent
  ): Observable<StudySubjectTableView> {
    return this.apiService.post(`/StudySubject/TableData`, event);
  }

  save(studySubject: StudySubject): Observable<ApiResult<StudySubject>> {
    return this.apiService.post<ApiResult<StudySubject>, StudySubject>(
      `/StudySubject`,
      studySubject
    );
  }

  update(studySubject: StudySubject): Observable<ApiResult<StudySubject>> {
    return this.apiService.put<ApiResult<StudySubject>, StudySubject>(
      `/StudySubject`,
      studySubject
    );
  }

  delete(studySubjectId: number): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<StudySubject>>(
      `/StudySubject/${studySubjectId}`
    );
  }
}
