import { Injectable } from '@angular/core';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { Observable } from 'rxjs';
import {LazyLoadEvent} from "primeng/api";
import {City, CityTableView} from "@msh/configurations/domain-configurations";

@Injectable({
  providedIn: 'root',
})
export class CityApiService {
  constructor(private apiService: APIService) {}

  loadDropdownList(): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<number>[]>>(
      `/City/DropdownList`
    );
  }
  loadCities(event: LazyLoadEvent): Observable<CityTableView> {
    return this.apiService.post(`/City/TableData`, event);
  }

  save(city: City): Observable<ApiResult<City>> {
    return this.apiService.post<ApiResult<City>, City>(
      `/City`,
      city
    );
  }
  update(city: City): Observable<ApiResult<City>> {
    return this.apiService.put<ApiResult<City>, City>(
      `/City`,
      city
    );
  }

  delete(cityId: number): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<City>>(
      `/City/${cityId}`
    );
  }
}
