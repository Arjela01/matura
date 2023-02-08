import { APIService } from '@msh/shared/util-shared';
import { Injectable } from '@angular/core';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { Observable } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import {
  Region,
  RegionTableView,
} from '@msh/shared/domain-models';

@Injectable({
  providedIn: 'root',
})
export class RegionApiService {
  constructor(private apiService: APIService) {}

  loadDropdownList(): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<number>[]>>(
      `/Region/DropdownList`
    );
  }
  loadRegions(event: LazyLoadEvent): Observable<RegionTableView> {
    return this.apiService.post(`/Region/TableData`, event);
  }

  save(region: Region): Observable<ApiResult<Region>> {
    return this.apiService.post<ApiResult<Region>, Region>(`/Region`, region);
  }

  update(region: Region): Observable<ApiResult<Region>> {
    return this.apiService.put<ApiResult<Region>, Region>(`/Region`, region);
  }

  delete(regionId: string): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<Region>>(`/Region/${regionId}`);
  }
}
