import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { environment } from '@msh/shared/environments';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CityApiService {
  constructor(private http: HttpClient) {}

  loadDropdownList(): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.http.get<ApiResult<DropdownModel<number>[]>>(
      `${environment.api_url}/City/DropdownList`
    );
  }
}
