import { Injectable } from '@angular/core';
import { A1ZCategory, A1ZCategoryTableView } from '@msh/shared/domain-models';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class A1ZCategoryApiService {
  constructor(private apiService: APIService) {}

  loadDropdownList(): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.apiService.post<ApiResult<DropdownModel<number>[]>, null>(
      `/A1ZCategory/DropdownList`
    );
  }
  loadA1ZCategories(
    event: TableLazyLoadEvent
  ): Observable<A1ZCategoryTableView> {
    return this.apiService.post(`/A1ZCategory/TableData`, event);
  }

  save(a1zCategory: A1ZCategory): Observable<ApiResult<A1ZCategory>> {
    return this.apiService.post<ApiResult<A1ZCategory>, A1ZCategory>(
      `/A1ZCategory`,
      a1zCategory
    );
  }
  update(a1zCategory: A1ZCategory): Observable<ApiResult<A1ZCategory>> {
    return this.apiService.post<ApiResult<A1ZCategory>, A1ZCategory>(
      `/A1ZCategory/Update`,
      a1zCategory
    );
  }

  delete(a1zCategory: string): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<A1ZCategory>>(
      `/A1ZCategory/${a1zCategory}`
    );
  }
}
