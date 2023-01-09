import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, UserTableView } from '@msh/configurations/domain-configurations';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  constructor(private http: HttpClient, private apiService: APIService) {}

  loadDummyHighSchools(): Observable<User[]> {
    return this.http.get<{ data: User[] }>('./users.json').pipe(
      map(response => {
        return response.data as User[];
      })
    );
  }

  loadUsers(event: LazyLoadEvent): Observable<UserTableView> {
    return this.apiService.post('', event);
  }

  save(user: User): Observable<ApiResult<User>> {
    return this.apiService.post<ApiResult<User>, User>('', user);
  }

  update(user: User): Observable<ApiResult<User>> {
    return this.apiService.put<ApiResult<User>, User>('', user);
  }

  delete(userId: number): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<User>>(`/${userId}`);
  }
}
