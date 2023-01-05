import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@msh/configurations/domain-configurations';
import { APIService } from '@msh/shared/util-shared';
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
}
