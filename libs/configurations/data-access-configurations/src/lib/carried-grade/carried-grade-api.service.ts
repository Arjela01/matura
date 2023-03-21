import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CarriedGrade } from '@msh/applications/domain-application';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CarriedGradeApiService {
  constructor(private apiService: APIService) {}

  getByNid(nid: string, type: string): Observable<ApiResult<CarriedGrade[]>> {
    return this.apiService.get(
      `/CarriedGrade`,
      new HttpParams({
        fromObject: {
          nid: nid,
          type: type,
        },
      })
    );
  }
}
