import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HighSchool } from '@msh/configurations/domain-configurations';
import { APIService } from '@msh/shared/util-shared';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HighSchoolApiService {
  constructor(private http: HttpClient, private apiService: APIService) {}

  loadDummyHighSchools(): Observable<HighSchool[]> {
    return this.http
      .get<{ data: HighSchool[] }>('assets/demo/data/high-schools.json')
      .pipe(
        map(response => {
          return response.data as HighSchool[];
        })
      );
  }
}
