import { Injectable } from '@angular/core';
import { APIService } from '@msh/shared/util-shared';
import { Observable } from 'rxjs';
import { UserResetPasswordModel } from '@msh/shared/domain-models';
import { ApiResult } from '@msh/shared/data-access-shared';

@Injectable({
  providedIn: 'root',
})
export class UserResetPasswordApiService {
  constructor(private apiService: APIService) {}

  userChangePassword(
    userResetPassword: UserResetPasswordModel
  ): Observable<ApiResult<UserResetPasswordModel>> {
    return this.apiService.post<
      ApiResult<UserResetPasswordModel>,
      UserResetPasswordModel
    >(`/User/ChangePassword`, userResetPassword);
  }
  getNewPassword(): Observable<ApiResult<UserResetPasswordModel>> {
    return this.apiService.get(
      `/User/ChangePassword`
    );
  }
}
