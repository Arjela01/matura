import { Injectable } from '@angular/core';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { AcademicYear, AcademicYearTableView } from '@msh/shared/domain-models';
import { APIService } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { Observable } from 'rxjs';

export const ACADEMIC_YEAR_KEY = 'academicYear';
@Injectable({
  providedIn: 'root',
})
export class AcademicYearApiService {
  constructor(private apiService: APIService) {}

  getAcademicYears(): Observable<any> {
    return this.apiService.get(`/AcademicYear`);
  }
  getAcademicYearsFiltered(): Observable<any> {
    return this.apiService.get(`/AcademicYear/DropdownListFilter`);
  }
  loadDropdownList(): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<number>[]>>(
      `/AcademicYear/DropdownList`
    );
  }
  loadAcademicYears(
    event: TableLazyLoadEvent
  ): Observable<AcademicYearTableView> {
    return this.apiService.post(`/AcademicYear/TableData`, event);
  }

  save(academicYear: AcademicYear): Observable<ApiResult<AcademicYear>> {
    return this.apiService.post<ApiResult<AcademicYear>, AcademicYear>(
      `/AcademicYear`,
      academicYear
    );
  }
  update(academicYear: AcademicYear): Observable<ApiResult<AcademicYear>> {
    return this.apiService.post<ApiResult<AcademicYear>, AcademicYear>(
      `/AcademicYear/Update`,
      academicYear
    );
  }

  delete(academicYearId: number): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<AcademicYear>>(
      `/AcademicYear/${academicYearId}`
    );
  }
}
