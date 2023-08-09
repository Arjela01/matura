import { Injectable } from '@angular/core';
import { University, UniversityTableView } from '@msh/shared/domain-models';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UniversityApiService {
  constructor(private apiService: APIService) {}

  loadUniversities(event: TableLazyLoadEvent): Observable<UniversityTableView> {
    return this.apiService.post(`/University/TableData`, event);
  }

  save(university: University): Observable<ApiResult<University>> {
    return this.apiService.post<ApiResult<University>, University>(
      `/University`,
      university
    );
  }

  update(university: University): Observable<ApiResult<University>> {
    return this.apiService.put<ApiResult<University>, University>(
      `/University`,
      university
    );
  }

  delete(universityId: string): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<University>>(
      `/University/${universityId}`
    );
  }

  loadDropdownList(): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<number>[]>>(
      `/University/DropdownList`
    );
  }
}
