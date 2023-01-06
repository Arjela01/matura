import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProfileGroup } from '@msh/configurations/domain-configurations';
import { APIService } from '@msh/shared/util-shared';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileGroupApiService {
  constructor(private http: HttpClient, private apiService: APIService) {}

  loadDummyProfileGroup(): Observable<ProfileGroup[]> {
    return this.http
      .get<{ profile: ProfileGroup[] }>('assets/demo/profile/profile-group.json')
      .pipe(
        map(response => {
          return response.profile as ProfileGroup[];
        })
      );
  }
}
