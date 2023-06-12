import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResult } from '@msh/shared/data-access-shared';
import { AcademicYear } from '@msh/shared/domain-models';
import { APIService } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DiplomasStudentApiService {
  constructor(private apiService: APIService) {}

  exportDiplomasStudent(id: string): Observable<ApiResult<unknown>> {
    const academicYear = JSON.parse(
      localStorage.getItem('academicYear') as string
    ) as AcademicYear;
    return this.apiService.get<any>(
      `/PrintedDiplomas/${id}?academicYearId=${academicYear.id}`,
      new HttpParams(),
      'blob'
    );
  }
  exportAllDiplomas(data: string): Observable<ApiResult<unknown>> {
    return this.apiService.get<any>(
      `/PrintedDiplomas/GenerateDiplomasPdf${data}`,
      new HttpParams(),
      'blob'
    );
  }

  loadStudentDiplomas(event: LazyLoadEvent): Observable<any> {
    return this.apiService.post(`/PrintedDiplomas/TableData`, event).pipe(
      map((data: any) => data),
      catchError(error => throwError(error))
    );
  }
}
