import { Injectable } from '@angular/core';
import { APIService } from '@msh/shared/util-shared';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiResult } from '@msh/shared/data-access-shared';
import { SealDiplomaModel } from '@msh/shared/domain-models';

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

  sendDiplomaToSeal(data: SealDiplomaModel): Observable<any> {
    return this.apiService.post(`/DiplomasHistory`, data);
  }
}
