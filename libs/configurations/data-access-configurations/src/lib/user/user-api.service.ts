import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import {
  ChangeUserStatusDto,
  User,
  UserTableView,
} from '@msh/shared/domain-models';
import { APIService } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  constructor(private http: HttpClient, private apiService: APIService) {}

  loadUsers(event: TableLazyLoadEvent): Observable<UserTableView> {
    return this.apiService.post(`/User/TableData`, event);
  }

  getUserById(id: string): Observable<ApiResult<User>> {
    return this.apiService.get(`/User/${id}`);
  }

  changeUserStatus(user: ChangeUserStatusDto): Observable<ApiResult<User>> {
    return this.apiService.post<ApiResult<User>, ChangeUserStatusDto>(
      '/User/SetDisabled',
      user
    );
  }

  generateNewPass(id: string): Observable<ApiResult<User>> {
    return this.apiService.get(`/User/ResetPassword/${id}`);
  }

  save(user: User): Observable<ApiResult<User>> {
    return this.apiService.post<ApiResult<User>, User>('/User', user);
  }

  update(user: User): Observable<ApiResult<User>> {
    return this.apiService.put<ApiResult<User>, User>('/User', user);
  }

  delete(userId: string): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<User>>(`/User/${userId}`);
  }
  loadDropdownList(): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<number>[]>>(
      `/User/DropdownList`
    );
  }
}
