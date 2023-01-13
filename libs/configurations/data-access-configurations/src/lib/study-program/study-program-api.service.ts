import { Injectable } from '@angular/core';
import {
  StudyProgram,
  StudyProgramsTableView,
} from '@msh/configurations/domain-configurations';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudyProgramApiService {
  constructor(private apiService: APIService) {}

  loadDropDownList(): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<number>[]>>(
      '/StudyProgram/DropDownList'
    );
  }

  loadStudyPrograms(event: LazyLoadEvent): Observable<StudyProgramsTableView> {
    return this.apiService.post(`/StudyProgram/TableData`, event);
  }

  save(studyProgram: StudyProgram): Observable<ApiResult<StudyProgram>> {
    return this.apiService.post<ApiResult<StudyProgram>, StudyProgram>(
      `/StudyProgram`,
      studyProgram
    );
  }

  update(studyProgram: StudyProgram): Observable<ApiResult<StudyProgram>> {
    return this.apiService.put<ApiResult<StudyProgram>, StudyProgram>(
      `/StudyProgram`,
      studyProgram
    );
  }

  delete(studyProgramId: number): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<StudyProgram>>(
      `/StudyProgram/${studyProgramId}`
    );
  }
}
