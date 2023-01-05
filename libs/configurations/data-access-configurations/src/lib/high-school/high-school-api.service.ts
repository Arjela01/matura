import { Injectable } from '@angular/core';
import {
  HighSchool,
  HighSchoolTableView,
} from '@msh/configurations/domain-configurations';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HighSchoolApiService {
  constructor(private apiService: APIService) {}

  loadHighSchools(event: LazyLoadEvent): Observable<HighSchoolTableView> {
    return this.apiService.post(`/HighSchool/TableData`, event);
  }

  save(highSchool: HighSchool): Observable<ApiResult<HighSchool>> {
    return this.apiService.post<ApiResult<HighSchool>, HighSchool>(
      `/HighSchool`,
      highSchool
    );
  }

  update(highSchool: HighSchool): Observable<ApiResult<HighSchool>> {
    return this.apiService.put<ApiResult<HighSchool>, HighSchool>(
      `/HighSchool`,
      highSchool
    );
  }

  delete(highSchoolId: number): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<HighSchool>>(
      `/HighSchool?id=${highSchoolId}`
    );
  }
}
