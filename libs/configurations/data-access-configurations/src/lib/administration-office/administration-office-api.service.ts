import { Injectable } from '@angular/core';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import {
  AdministrationOffice,
  AdministrationOfficeTableView,
  ChangeAdministrationOfficeStatusDto,
} from '@msh/shared/domain-models';
import { APIService } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdministrationOfficeApiService {
  constructor(private apiService: APIService) {}

  loadDropdownList(): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<number>[]>>(
      `/AdministrationOffice/DropdownList`
    );
  }

  changeStatus(
    administrationOffice: ChangeAdministrationOfficeStatusDto
  ): Observable<ApiResult<AdministrationOffice>> {
    return this.apiService.post<
      ApiResult<AdministrationOffice>,
      ChangeAdministrationOfficeStatusDto
    >('/AdministrationOffice/UpdateIsAllowedToLogin', administrationOffice);
  }

  loadOnlyDars(): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<number>[]>>(
      `/AdministrationOffice/IsDarDropdown`
    );
  }
  loadAdministrationOffices(
    event: TableLazyLoadEvent
  ): Observable<AdministrationOfficeTableView> {
    return this.apiService.post(`/AdministrationOffice/TableData`, event);
  }

  getAll(): Observable<any> {
    return this.apiService.get(`/AdministrationOffice`);
  }

  save(
    administrationOffice: AdministrationOffice
  ): Observable<ApiResult<AdministrationOffice>> {
    return this.apiService.post<
      ApiResult<AdministrationOffice>,
      AdministrationOffice
    >(`/AdministrationOffice`, administrationOffice);
  }

  update(
    administrationOffice: AdministrationOffice
  ): Observable<ApiResult<AdministrationOffice>> {
    return this.apiService.post<
      ApiResult<AdministrationOffice>,
      AdministrationOffice
    >(`/AdministrationOffice/Update`, administrationOffice);
  }
  delete(administrationOfficeId: number): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<AdministrationOffice>>(
      `/AdministrationOffice/${administrationOfficeId}`
    );
  }
}
