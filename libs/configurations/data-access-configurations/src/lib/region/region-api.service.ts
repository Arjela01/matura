import { APIService } from '@msh/shared/util-shared';
import { Injectable } from '@angular/core';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegionApiService {
  constructor(private apiService: APIService) {}

  loadDropdownList(): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<number>[]>>(
      `/Region/DropdownList`
    );
  }
}
