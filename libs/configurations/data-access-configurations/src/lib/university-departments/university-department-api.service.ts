import { Injectable } from '@angular/core';
import {
  UniversityDepartment,
  UniversityDepartmentTableView,
} from '@msh/shared/domain-models';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UniversityDepartmentApiService {
  constructor(private apiService: APIService) {}

  loadUniversities(
    event: TableLazyLoadEvent
  ): Observable<UniversityDepartmentTableView> {
    return this.apiService.post(`/UniversityDepartment/TableData`, event);
  }

  save(
    universityDepartment: UniversityDepartment
  ): Observable<ApiResult<UniversityDepartment>> {
    return this.apiService.post<
      ApiResult<UniversityDepartment>,
      UniversityDepartment
    >(`/UniversityDepartment`, universityDepartment);
  }

  update(
    universityDepartment: UniversityDepartment
  ): Observable<ApiResult<UniversityDepartment>> {
    return this.apiService.put<
      ApiResult<UniversityDepartment>,
      UniversityDepartment
    >(`/UniversityDepartment`, universityDepartment);
  }

  delete(universityDepartmentId: string): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<UniversityDepartment>>(
      `/UniversityDepartment/${universityDepartmentId}`
    );
  }

  loadDropdownList(): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<number>[]>>(
      `/UniversityDepartment/DropdownList`
    );
  }
}
