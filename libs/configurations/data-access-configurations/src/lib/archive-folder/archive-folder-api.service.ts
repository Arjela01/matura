import { Injectable } from '@angular/core';
import {
  Ar,
  Folders,
} from '@msh/configurations/domain-configurations';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArchiveFolderApiService {
  constructor(private apiService: APIService) {}

  loadDropDownList(): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<number>[]>>(
      '/Folders/DropdownList'
    );
  }

  loadHighSchools(event: LazyLoadEvent): Observable<FoldersTableView> {
    return this.apiService.post(`/Folders/TableData`, event);
  }

  save(folder: Folders): Observable<ApiResult<Folders>> {
    return this.apiService.post<ApiResult<Folders>, Folders>(
      `/Folders`,
      folder
    );
  }

  update(folder: Folders): Observable<ApiResult<Folders>> {
    return this.apiService.put<ApiResult<Folders>, Folders>(
      `/Folders`,
      folder
    );
  }

  delete(folderId: number): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<Folders>>(
      `/Folders/${folderId}`
    );
  }
}
