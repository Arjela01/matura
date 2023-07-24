import { Injectable } from '@angular/core';
import { DataExport, DataExportTableView } from '@msh/shared/domain-models';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DataExportApiService {
  constructor(private apiService: APIService) {}

  loadDataExports(event: LazyLoadEvent): Observable<DataExportTableView> {
    return this.apiService.post(`/DataExport/TableData`, event);
  }

  loadDropdownList(
    current: number | null = null
  ): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<number>[]>>(
      `/DataExport/DropdownList`,
      current ? new HttpParams().append('ignore', current) : new HttpParams()
    );
  }

  save(dataExport: DataExport): Observable<ApiResult<DataExport>> {
    return this.apiService.post<ApiResult<DataExport>, DataExport>(
      `/DataExport`,
      dataExport
    );
  }

  update(dataExport: DataExport): Observable<ApiResult<DataExport>> {
    return this.apiService.put<ApiResult<DataExport>, DataExport>(
      `/DataExport`,
      dataExport
    );
  }

  delete(dataExport: number): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<DataExport>>(
      `/DataExport/${dataExport}`
    );
  }
}
