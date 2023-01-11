import { Injectable } from '@angular/core';
import {
  Region,
  RegionTableView,
} from '@msh/configurations/domain-configurations';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegionsApiService {
  constructor(private apiService: APIService) {}

  loadRegions(event: LazyLoadEvent): Observable<RegionTableView> {
    return this.apiService.post(`/Region/TableData`, event);
  }

  save(region: Region): Observable<ApiResult<Region>> {
    return this.apiService.post<ApiResult<Region>, Region>(
      `/Region`,
      region
    );
  }

  update(region: Region): Observable<ApiResult<Region>> {
    return this.apiService.put<ApiResult<Region>, Region>(
      `/Region`,
      region
    );
  }

  delete(regionId: string): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<Region>>(
      `/Region/${regionId}`
    );
  }
}
