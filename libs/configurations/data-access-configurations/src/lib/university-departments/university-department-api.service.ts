import { Injectable } from '@angular/core';
import {
  University,
  UniversityTableView,
} from '@msh/configurations/domain-configurations';
import {ApiResult, DropdownModel} from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UniversityDepartmentApiService {
  constructor(private apiService: APIService) {}

  loadUniversities(event: LazyLoadEvent): Observable<UniversityTableView> {
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
