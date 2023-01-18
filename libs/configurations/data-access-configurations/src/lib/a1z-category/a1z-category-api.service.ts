import { Injectable } from '@angular/core';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { Observable } from 'rxjs';
import {LazyLoadEvent} from "primeng/api";
import {A1ZCategory, A1ZCategoryTableView} from "@msh/configurations/domain-configurations";

@Injectable({
  providedIn: 'root',
})
export class A1ZCategoryApiService {
  constructor(private apiService: APIService) {}

  loadDropdownList(): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<number>[]>>(
      `/A1ZCategory/DropdownList`
    );
  }
  loadA1ZCategories(event: LazyLoadEvent): Observable<A1ZCategoryTableView> {
    return this.apiService.post(`/A1ZCategory/TableData`, event);
  }

  save(a1zCategory: A1ZCategory): Observable<ApiResult<A1ZCategory>> {
    return this.apiService.post<ApiResult<A1ZCategory>, A1ZCategory>(
      `/A1ZCategory`,
      a1zCategory
    );
  }
  update(a1zCategory: A1ZCategory): Observable<ApiResult<A1ZCategory>> {
    return this.apiService.put<ApiResult<A1ZCategory>, A1ZCategory>(
      `/A1ZCategory`,
      a1zCategory
    );
  }

  delete(a1zCategory: string): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<A1ZCategory>>(
      `/A1ZCategory/${a1zCategory}`
    );
  }

}
