import { Injectable } from '@angular/core';
import { ApiResult } from '@msh/shared/data-access-shared';
import { ArchiveExam, ArchiveExamView } from '@msh/shared/domain-models';
import { APIService } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { Observable } from 'rxjs';

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

  loadArchiveExams(event: TableLazyLoadEvent, id: any): Observable<ArchiveExamView> {
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
  getExamsByFolderId(archiveFolderId?: number): Observable<ApiResult<any>> {
    return this.apiService.get<ApiResult<ArchiveExam>>(
      `/ArchiveExam/GetById/${archiveFolderId}`
    );
  }
}
