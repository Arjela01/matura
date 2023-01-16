import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AdministrationOfficeTableView,
  UniversityTableView,
  User,
  UserTableView
} from '@msh/configurations/domain-configurations';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { Observable } from 'rxjs';
import {LazyLoadEvent} from "primeng/api";

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  constructor(private http: HttpClient, private apiService: APIService) {}

  loadUsers(event: LazyLoadEvent): Observable<UserTableView> {
    return this.apiService.post(`/User/TableData`, event);
  }

  save(user: User): Observable<ApiResult<User>> {
    return this.apiService.post<ApiResult<User>, User>('/User', user);
  }

  update(user: User): Observable<ApiResult<User>> {
    return this.apiService.put<ApiResult<User>, User>('/User', user);
  }

  delete(userId: number): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<User>>(`/User/${userId}`);
  }
}
