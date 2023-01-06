import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HighSchool } from '@msh/configurations/domain-configurations';
import { map, Observable } from 'rxjs';
import { environment } from '@msh/shared/environments';
import { LazyLoadEvent } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ExamVersionApiService {
  constructor(private http: HttpClient) {}

  loadExamVersions(event: LazyLoadEvent): Observable<any> {
    return this.http.post(`${environment.api_url}//TableData`, event)
  }

  loadDummyExamVersions(): Observable<HighSchool[]> {
    return this.http
      .get<{ data: HighSchool[] }>('assets/demo/data/high-schools.json')
      .pipe(
        map(response => {
          return response.data as HighSchool[];
        })
      );
  }
}
