import { Injectable } from '@angular/core';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { Observable } from 'rxjs';
import {
  ArchiveFolder,
  ArchiveFolderTableView
} from "../../../../domain-configurations/src/archive-folder/archive-folder.model";

@Injectable({
  providedIn: 'root',
})
export class ArchiveFolderApiService {
  constructor(private apiService: APIService) {}

  loadDropDownList(): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<number>[]>>(
      '/ArchiveFolder/DropdownList'
    );
  }

  loadArchiveFolder(event: LazyLoadEvent): Observable<ArchiveFolderTableView> {
    return this.apiService.post(`/ArchiveFolder/TableData`, event);
  }

  save(folder: ArchiveFolder): Observable<ApiResult<ArchiveFolder>> {
    return this.apiService.post<ApiResult<ArchiveFolder>, ArchiveFolder>(
      `/ArchiveFolder`,
      folder
    );
  }

  update(archiveFolder: ArchiveFolder): Observable<ApiResult<ArchiveFolder>> {
    return this.apiService.put<ApiResult<ArchiveFolder>, ArchiveFolder>(
      `/ArchiveFolder`,
      archiveFolder
    );
  }

  delete(archiveFolderId: number): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<ArchiveFolder>>(
      `/ArchiveFolder/${archiveFolderId}`
    );
  }
}
