import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResult } from '@msh/shared/data-access-shared';
import { User, UserTableView } from '@msh/shared/domain-models';
import { APIService } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  constructor(private http: HttpClient, private apiService: APIService) {}

  loadUsers(event: LazyLoadEvent): Observable<UserTableView> {
    return this.apiService.post(`/User/TableData`, event);
  }

  getUserById(id: string): Observable<ApiResult<User>> {
    return this.apiService.get(`/User/${id}`);
  }

  changeUserStatus(
    id: number
  ): Observable<ApiResult<User>> {
    return this.apiService.put<ApiResult<User>, any>(
      `/User/UpdateStatus`,
      {
        id: id,
      }
    );
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
}
