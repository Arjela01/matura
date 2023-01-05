import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HighSchool } from '@msh/configurations/domain-configurations';
import { APIService } from '@msh/shared/util-shared';
import { map, Observable } from 'rxjs';
import { environment } from '@msh/shared/environments';
import { LazyLoadEvent } from 'primeng/api';
import { ApiResult } from '@msh/shared/data-access-shared';

@Injectable({
  providedIn: 'root',
})
export class HighSchoolApiService {
  constructor(private http: HttpClient) {}

  loadHighSchools(event: LazyLoadEvent): Observable<any> {
    return this.http.post(`${environment.api_url}/HighSchool/TableData`, event);
  }

  save(highSchool: HighSchool): Observable<ApiResult<HighSchool>> {
    return this.http.post<ApiResult<HighSchool>>(
      `${environment.api_url}/HighSchool`,
      highSchool
    );
  }

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
