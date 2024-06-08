import { Injectable } from '@angular/core';
import { APIService } from '@msh/shared/util-shared';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurrentYearStudentGradesApiService {
  constructor(private apiService: APIService) {}

  getCurrentYearGradesForStudentByNid(nid: string): Observable<any> {
    return this.apiService.get(
      `/StudentGrades/GetCurrentYearGradesForStudentByNid/${nid}`
    );
  }

  getGradesForStudentByNid(nid: string): Observable<any> {
    return this.apiService.get(
      `/StudentGrades/GetGradesForStudentByNid/${nid}`
    );
  }
}
