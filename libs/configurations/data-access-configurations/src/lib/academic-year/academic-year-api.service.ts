import { Injectable } from '@angular/core';
import {
  AcademicYear,
  AcademicYearTableView,
} from '@msh/shared/domain-models';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AcademicYearApiService {
  constructor(private apiService: APIService) {}

  getAcademicYears(): Observable<AcademicYear> {
    return this.apiService.get(`/AcademicYear`);
  }
  loadDropdownList(): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<number>[]>>(
      `/AcademicYear/DropdownList`
    );
  }
  loadAcademicYears(event: LazyLoadEvent): Observable<AcademicYearTableView> {
    return this.apiService.post(`/AcademicYear/TableData`, event);
  }

  save(academicYear: AcademicYear): Observable<ApiResult<AcademicYear>> {
    return this.apiService.post<ApiResult<AcademicYear>, AcademicYear>(
      `/AcademicYear`,
      academicYear
    );
  }
  update(academicYear: AcademicYear): Observable<ApiResult<AcademicYear>> {
    return this.apiService.put<ApiResult<AcademicYear>, AcademicYear>(
      `/AcademicYear`,
      academicYear
    );
  }

  delete(academicYearId: string): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<AcademicYear>>(
      `/AcademicYear/${academicYearId}`
    );
  }
}
