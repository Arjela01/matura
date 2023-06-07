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
}
