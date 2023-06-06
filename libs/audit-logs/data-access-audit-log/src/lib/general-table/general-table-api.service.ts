import { Injectable } from '@angular/core';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeneralTableApiService {
  constructor(private apiService: APIService) {}

  getAuditTablesList(): Observable<ApiResult<any>> {
    return this.apiService.get<ApiResult<any>>(`/Audit/GetAuditTablesList `);
  }
}
