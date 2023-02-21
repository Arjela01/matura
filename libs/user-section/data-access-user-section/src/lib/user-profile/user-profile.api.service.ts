import { Injectable} from '@angular/core';
import { APIService } from '@msh/shared/util-shared';
import { Observable } from 'rxjs';
import {UserProfile} from "@msh/user-section/domain-user-section";
import {ApiResult} from "@msh/shared/data-access-shared";

@Injectable({
  providedIn: 'root',
})
export class UserProfileApiService {
  constructor(private apiService: APIService) {}

  getLoggedInUserData(): Observable<ApiResult<UserProfile>> {
    return this.apiService.get(`/User/Profile`);
  }
}
