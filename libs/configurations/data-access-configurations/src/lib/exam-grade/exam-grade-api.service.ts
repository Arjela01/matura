import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExamGradeApiService {
  constructor(
    private http: HttpClient,
    private apiService: APIService
  ) {}

  //TODO: Replace any with ExamGrade model
  getExamGrade(studentId: number): Observable<ApiResult<any>> {
    return this.apiService.get(`/ExamGrade/${studentId}`);
  }
}
