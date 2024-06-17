import { Injectable } from '@angular/core';
import { Gender, GenderTableView } from '@msh/shared/domain-models';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GendersApiService {
  constructor(private apiService: APIService) {}

  loadGenders(event: TableLazyLoadEvent): Observable<GenderTableView> {
    return this.apiService.post(`/Gender/TableData`, event);
  }

  save(gender: Gender): Observable<ApiResult<Gender>> {
    return this.apiService.post<ApiResult<Gender>, Gender>(`/Gender`, gender);
  }

  update(gender: Gender): Observable<ApiResult<Gender>> {
    return this.apiService.post<ApiResult<Gender>, Gender>(
      `/Gender/Update`,
      gender
    );
  }

  delete(genderId: number): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<Gender>>(`/Gender/${genderId}`);
  }
  loadDropdownList(): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<number>[]>>(
      `/Gender/DropdownList`
    );
  }
}
