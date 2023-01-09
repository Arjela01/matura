import {Injectable} from '@angular/core';
import {catchError, map, Observable, shareReplay, throwError} from 'rxjs';
import {LazyLoadEvent} from 'primeng/api';
import {ExamVersion, ExamVersionTableView} from "@msh/configurations/domain-configurations";
import {ApiResult} from "@msh/shared/data-access-shared";
import {APIService} from "@msh/shared/util-shared";

@Injectable({
  providedIn: 'root',
})
export class ExamVersionApiService {
  constructor(private apiService: APIService) {
  }

  loadExamVersions(event: LazyLoadEvent): Observable<ExamVersionTableView> {
    return this.apiService.post(`//TableData`, event)

  }


  save(examVersion: ExamVersion): Observable<ApiResult<ExamVersion>> {
    return this.apiService.post<ApiResult<ExamVersion>, ExamVersion>(
      `/`,
      examVersion
    ).pipe(
      map(data => data),
      catchError((error) => throwError(error)),
      shareReplay()
    );
  }

  update(examVersion: ExamVersion): Observable<ApiResult<ExamVersion>> {
    return this.apiService.put<ApiResult<ExamVersion>, ExamVersion>(
      `/`,
      examVersion
    ).pipe(
      map(data => data),
      catchError((error) => throwError(error)),
      shareReplay()
    );
  }

  delete(examVersionId: number): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<ExamVersion>>(
      `//${examVersionId}`
    ).pipe(
      map(data => data),
      catchError((error) => throwError(error)),
      shareReplay()
    );
  }

}
