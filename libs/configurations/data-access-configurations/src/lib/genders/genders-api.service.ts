import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gender } from '@msh/configurations/domain-configurations';
import { APIService } from '@msh/shared/util-shared';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GendersApiService {
  constructor(private http: HttpClient, private apiService: APIService) { }
  loadDummyGenders(): Observable<Gender[]> {
    return this.http
      .get<{ data: Gender[] }>('assets/demo/data/genders.json')
      .pipe(
        map(response => {
          return response.data as Gender[];
        })
      );
  }
}
