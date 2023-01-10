import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@msh/configurations/domain-configurations';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  constructor(private http: HttpClient, private apiService: APIService) {}

  loadUsers(): Observable<ApiResult<User[]>> {
    return this.apiService.get('/UserManagement');
  }

  save(user: User): Observable<ApiResult<User>> {
    return this.apiService.post<ApiResult<User>, User>('/UserManagement', user);
  }

  update(user: User): Observable<ApiResult<User>> {
    return this.apiService.put<ApiResult<User>, User>('/UserManagement', user);
  }

  delete(userId: number): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<User>>(`/${userId}`);
  }
}
