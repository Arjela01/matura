import { Injectable} from '@angular/core';
import { APIService } from '@msh/shared/util-shared';
import { Observable } from 'rxjs';
import {ApiResult} from "@msh/shared/data-access-shared";
import {UserProfile} from "@msh/shared/domain-models";

@Injectable({
  providedIn: 'root',
})
export class UserProfileApiService {
  constructor(private apiService: APIService) {}

  getLoggedInUserData(): Observable<ApiResult<UserProfile>> {
    return this.apiService.get(`/User/Profile`);
  }
}
