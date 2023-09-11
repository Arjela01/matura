import { Injectable } from '@angular/core';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { HighSchool, HighSchoolTableView } from '@msh/shared/domain-models';
import { APIService } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HighSchoolApiService {
  constructor(private apiService: APIService) {}

  loadDropDownList(): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<number>[]>>(
      '/HighSchool/DropdownList'
    );
  }

  loadHighSchools(event: TableLazyLoadEvent): Observable<HighSchoolTableView> {
    return this.apiService.post(`/HighSchool/TableData`, event);
  }

  forAdministrationOffice(
    administrationOfficeId?: string
  ): Observable<ApiResult<DropdownModel<string>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<string>[]>>(
      `/HighSchool/ForAdministrationOffice/${administrationOfficeId}`
    );
  }

  save(highSchool: HighSchool): Observable<ApiResult<HighSchool>> {
    return this.apiService.post<ApiResult<HighSchool>, HighSchool>(
      `/HighSchool`,
      highSchool
    );
  }

  update(highSchool: HighSchool): Observable<ApiResult<HighSchool>> {
    return this.apiService.post<ApiResult<HighSchool>, HighSchool>(
      `/HighSchool/Update`,
      highSchool
    );
  }

  delete(highSchoolId: number): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<HighSchool>>(
      `/HighSchool/${highSchoolId}`
    );
  }
}
