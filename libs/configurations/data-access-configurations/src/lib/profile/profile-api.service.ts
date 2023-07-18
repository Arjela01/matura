import { Injectable } from '@angular/core';
import {ApiResult, DropdownModel} from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { Observable } from 'rxjs';
import {Profile, ProfileTableView} from "@msh/shared/domain-models";
import {HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class ProfileApiService {
  constructor(private apiService: APIService) {}
  loadDropdownList(): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<number>[]>>(
      `/Profile/DropdownList`
    );
  }
  loadProfiles(event: LazyLoadEvent): Observable<ProfileTableView> {
    return this.apiService.post(`/Profile/TableData`, event);
  }

  save(profile: Profile): Observable<ApiResult<Profile>> {
    return this.apiService.post<ApiResult<Profile>, Profile>(
      `/Profile`,
      profile
    );
  }

  update(profile: Profile): Observable<ApiResult<Profile>> {
    return this.apiService.put<ApiResult<Profile>, Profile>(
      `/Profile`,
      profile
    );
  }

  delete(profileId: number): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<Profile>>(
      `/Profile/${profileId}`
    );
  }

  exportTemplate(): Observable<ApiResult<unknown>> {
    return this.apiService.get<any>(
      `/Profile/Export`,
      new HttpParams(),
      'blob'
    );
  }
}
