import { Injectable } from '@angular/core';
import {
  City,
  CityTableView,
} from '@msh/configurations/domain-configurations';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CitiesApiService {
  constructor(private apiService: APIService) {}

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
