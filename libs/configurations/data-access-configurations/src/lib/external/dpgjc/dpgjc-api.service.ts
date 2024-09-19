import { Injectable } from '@angular/core';
import { ApiResult } from '@msh/shared/data-access-shared';
import { DpgjcData } from '@msh/shared/domain-models';
import { APIService } from '@msh/shared/util-shared';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DpgjcApiService {
  constructor(private apiService: APIService) {}

  GetDpgjc(
    nid: string
  ): Observable<ApiResult<DpgjcData>> {
    return this.apiService.get<ApiResult<DpgjcData>>(
      `/Dpgjc/GetDpgjc/${nid}`
    );
  }
}
