import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {APIService} from "@msh/shared/util-shared";
import {Observable, of} from "rxjs";
import {Permission, PermissionCategory} from '@msh/shared/domain-models';
import {ApiResult} from "@msh/shared/data-access-shared";

@Injectable({
  providedIn: 'root'
})
export class PermissionsApiService {
  constructor(private http: HttpClient, private apiService: APIService) {}

  loadPermissions(): Observable<ApiResult<Permission[]>> {
    return this.apiService.get<ApiResult<Permission[]>>(`/Permission`);
  }

  loadPermissionCategories(): Observable<ApiResult<PermissionCategory[]>>{
    return this.apiService.get<ApiResult<PermissionCategory[]>>(`/PermissionCategory`);
  }
}
