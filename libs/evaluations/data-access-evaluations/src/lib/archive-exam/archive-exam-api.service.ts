import { Injectable } from '@angular/core';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { Observable } from 'rxjs';
import {
  ArchiveExam,
  ArchiveExamView,
} from '@msh/evaluations/domain-evaluations';

@Injectable({
  providedIn: 'root',
})
export class ArchiveExamApiService {
  constructor(private apiService: APIService) {}

  getById(id: any): Observable<ApiResult<ArchiveExam>> {
    return this.apiService.get<ApiResult<ArchiveExam>>(`/ArchiveExam/${id}`);
  }

  // getFolderByExamId(id: any): Observable<ArchiveFolder> {
  //   return this.apiService.get<any>(`/ArchiveExam/GetFolderByExamId/${id}`);
  // }
  //
  // loadDropDownList(): Observable<ApiResult<DropdownModel<number>[]>> {
  //   return this.apiService.get<ApiResult<DropdownModel<number>[]>>(
  //     '/ArchiveExam/DropdownList'
  //   );
  // }

  loadArchiveExams(event: LazyLoadEvent, id: any): Observable<ArchiveExamView> {
    return this.apiService.post(`/ArchiveExam/TableData/${id}`, event);
  }

  save(archiveExam: ArchiveExam): Observable<ApiResult<ArchiveExam>> {
    return this.apiService.post<ApiResult<ArchiveExam>, ArchiveExam>(
      `/ArchiveExam`,
      archiveExam
    );
  }

  update(archiveExam: ArchiveExam): Observable<ApiResult<ArchiveExam>> {
    return this.apiService.put<ApiResult<ArchiveExam>, ArchiveExam>(
      `/ArchiveExam`,
      archiveExam
    );
  }

  delete(archiveExamId: number): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<ArchiveExam>>(
      `/ArchiveExam/${archiveExamId}`
    );
  }
}
