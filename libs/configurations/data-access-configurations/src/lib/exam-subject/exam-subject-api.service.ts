import { Injectable } from '@angular/core';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { ExamSubject, ExamSubjectTableView } from '@msh/shared/domain-models';
import { APIService } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { Observable, catchError, map, shareReplay, throwError } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ExamSubjectApiService {
  constructor(private apiService: APIService) {}
  loadExamSubjects(event: LazyLoadEvent): Observable<ExamSubjectTableView> {
    return this.apiService.post(`/ExamSubject/TableData`, event);
  }

  loadDropDownList(id: string): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.apiService.get(`/ExamSubject/DropdownList/${id}`);
  }

  loadDropDownListNotMappedToProfiles(
    academicYearId?: number,
    profileId?: number,
    examTypeId?: number,
    examSubjectId?: string
  ): Observable<ApiResult<DropdownModel<string>[]>> {
    const query = {
      academicYearId: academicYearId,
      profileId: profileId,
      examTypeId: examTypeId,
      id: examSubjectId,
    };
    return this.apiService.post(`/ExamSubject/NotMappedToProfiles`, query);
  }

  save(examSubject: ExamSubject): Observable<ApiResult<ExamSubject>> {
    return this.apiService
      .post<ApiResult<ExamSubject>, ExamSubject>(`/ExamSubject`, examSubject)
      .pipe(
        map(data => data),
        catchError(error => throwError(error)),
        shareReplay()
      );
  }

  update(examSubject: ExamSubject): Observable<ApiResult<ExamSubject>> {
    return this.apiService
      .put<ApiResult<ExamSubject>, ExamSubject>(`/ExamSubject`, examSubject)
      .pipe(
        map(data => data),
        catchError(error => throwError(error)),
        shareReplay()
      );
  }

  delete(examSubjectId: string): Observable<ApiResult<unknown>> {
    return this.apiService
      .delete<ApiResult<ExamSubject>>(`/ExamSubject/${examSubjectId}`)
      .pipe(
        map(data => data),
        catchError(error => throwError(error)),
        shareReplay()
      );
  }
  loadDropdownList(): Observable<ApiResult<DropdownModel<string>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<string>[]>>(
      `/ExamSubject/DropdownList`
    );
  }

  forExamType(
    examTypeId?: number,
    academicYearId?: number,
    id?: string,
    profileID?: number,
    isProfileCheckDisabled?: boolean,
    applicationFormType?: string
  ): Observable<ApiResult<DropdownModel<string>[]>> {
    return this.apiService.post<ApiResult<DropdownModel<string>[]>, any>(
      `/ExamSubject/ForExamType`,
      {
        examTypeId: examTypeId,
        academicYearId: academicYearId,
        profileID: profileID,
        id: id,
        isProfileCheckDisabled: isProfileCheckDisabled,
        applicationFormType: applicationFormType,
      }
    );
  }

  exportTemplate(): Observable<ApiResult<unknown>> {
    return this.apiService.get<any>(
      `/ExamSubject/Export`,
      new HttpParams(),
      'blob'
    );
  }
}
