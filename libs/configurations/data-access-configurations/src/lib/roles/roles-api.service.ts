import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Role } from '@msh/configurations/domain-configurations';
import { APIService } from '@msh/shared/util-shared';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesApiService {
  constructor(private http: HttpClient, private apiService: APIService) { }

  loadDummyRoles(): Observable<Role[]> {
    return this.http
      .get<{ data: Role[] }>('assets/demo/data/roles.json')
      .pipe(
        map(response => {
          return response.data as Role[];
        })
      );
  }
}
