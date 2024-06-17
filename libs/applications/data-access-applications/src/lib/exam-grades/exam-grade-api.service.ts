import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { APIService } from '@msh/shared/util-shared';
import { ApiResult } from '@msh/shared/data-access-shared';
import { ExamGrade, ExamGradeDiscoveryResult } from '@msh/shared/domain-models';

@Injectable({
  providedIn: 'root',
})
export class ExamGradeApiService {
  constructor(private apiService: APIService) {}

  getById(id: any): Observable<ApiResult<any>> {
    return this.apiService.get<ApiResult<any>>(`/ExamGrade/${id}`);
  }

  discoverGrade(
    examTypeId: number,
    studentNid: string | undefined,
    examSubjectId: string | undefined
  ): Observable<ApiResult<ExamGradeDiscoveryResult>> {
    const body = {
      examTypeId: examTypeId,
      studentNid: studentNid,
      examSubjectId: examSubjectId,
    };
    return this.apiService.post(`/ExamGrade/DiscoverGrade`, body);
  }

  getGradesForStudentsById(id: string): Observable<ApiResult<ExamGrade[]>> {
    const url = `/ExamGrade/GetExamGradesByStudentId/${id}`;
    return this.apiService.get<ApiResult<ExamGrade[]>>(url);
  }
}
