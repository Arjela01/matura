import { environment } from '@msh/shared/environments';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';

@Injectable({
  providedIn: 'root',
})
export class RegionApiService {
  constructor(private http: HttpClient) {}

  loadDropdownList(): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.http.get<ApiResult<DropdownModel<number>[]>>(
      `${environment.api_url}/Region/DropdownList`
    );
  }
}
