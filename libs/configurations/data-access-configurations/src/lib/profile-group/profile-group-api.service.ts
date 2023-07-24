import { Injectable } from '@angular/core';
import { ProfileGroup, ProfileGroupTableView } from '@msh/shared/domain-models';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileGroupApiService {
  constructor(private apiService: APIService) {}

  loadDropdownList(): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<number>[]>>(
      `/ProfileGroup/DropdownList`
    );
  }

  loadProfileGroups(event: LazyLoadEvent): Observable<ProfileGroupTableView> {
    return this.apiService.post(`/ProfileGroup/TableData`, event);
  }

  save(profileGroup: ProfileGroup): Observable<ApiResult<ProfileGroup>> {
    return this.apiService.post<ApiResult<ProfileGroup>, ProfileGroup>(
      `/ProfileGroup`,
      profileGroup
    );
  }

  update(profileGroup: ProfileGroup): Observable<ApiResult<ProfileGroup>> {
    return this.apiService.put<ApiResult<ProfileGroup>, ProfileGroup>(
      `/ProfileGroup`,
      profileGroup
    );
  }

  delete(profileGroupId: number): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<ProfileGroup>>(
      `/ProfileGroup/${profileGroupId}`
    );
  }
}
