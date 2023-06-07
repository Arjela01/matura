import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DiplomasStudentApiService {
  constructor(private apiService: APIService) {}

  exportDiplomasStudent(id: string): Observable<ApiResult<unknown>> {
    return this.apiService.get<any>(
      `/PrintedDiplomas/${id}`,
      new HttpParams(),
      'blob'
    );
  }
  exportAllDiplomas(): Observable<ApiResult<unknown>> {
    return this.apiService.get<any>(
      `/PrintedDiplomas/GenerateDiplomasPdf?studentVersion=${1}&isPrinted=${true}&studentId=${231801168915}&academicYearId=${44}&darZaId=${18}`,
      new HttpParams(),
      'blob'
    );
  }
}
