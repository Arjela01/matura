import { Injectable } from '@angular/core';
import { APIService } from '@msh/shared/util-shared';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiResult } from '@msh/shared/data-access-shared';
import { ExamAssignmentImportCommand } from '@msh/configurations/domain-configurations';

@Injectable({
  providedIn: 'root',
})
export class DiplomasForStudentApiService {
  constructor(private apiService: APIService) {}

  getDiplomasForStudentById(id: string): Observable<any> {
    return this.apiService.get(
      `/DiplomasHistory/${id}`,
      new HttpParams(),
      'blob'
    );
  }

  sendDiplomaToSeal(data: {
    studentId: string;
    file: any;
  }): Observable<ApiResult<any>> {
    return this.apiService.post<ApiResult<any>, any>(`/DiplomasHistory`, data);
  }
}
