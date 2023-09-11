import { Injectable } from '@angular/core';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { Observable } from 'rxjs';
import {
  ActivateOverseerDarZa,
  ActivateOverseerDarZaTableView,
} from '@msh/shared/domain-models';

@Injectable({
  providedIn: 'root',
})
export class ActivateOverseerDarZaApiService {
  constructor(private apiService: APIService) {}

  getById(id: any): Observable<ApiResult<ActivateOverseerDarZa>> {
    return this.apiService.get<ApiResult<ActivateOverseerDarZa>>(
      `/ActivateOverseerDarZa/${id}`
    );
  }
  changeDarZaStatus(id: number): Observable<ApiResult<ActivateOverseerDarZa>> {
    return this.apiService.post<ApiResult<ActivateOverseerDarZa>, any>(
      `/ActivateOverseerDarZa/UpdateStatus`,
      {
        id: id,
      }
    );
  }

  loadActivateOverseerDarZa(
    event: TableLazyLoadEvent
  ): Observable<ActivateOverseerDarZaTableView> {
    return this.apiService.post(`/ArchiveFolder/TableData`, event);
  }
}
