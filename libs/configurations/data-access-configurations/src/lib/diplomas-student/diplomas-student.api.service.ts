import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AcademicYear, DiplomaStatusData } from '@msh/shared/domain-models';
import { APIService } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ApiResult } from '@msh/shared/data-access-shared';

@Injectable({
  providedIn: 'root',
})
export class DiplomasStudentApiService {
  constructor(private apiService: APIService) {}

  exportDiplomasStudent(id: string, allReports: boolean) {
    const academicYear = JSON.parse(
      localStorage.getItem('academicYear') as string
    ) as AcademicYear;
    return this.apiService.get<any>(
      `/Diplomas/${id}?academicYearId=${academicYear.id}&isReportAll=${allReports}`,
      new HttpParams(),
      'blob'
    );
  }

  printElectronicSealForForeignStudent(id: string, allReports: boolean) {
    const academicYear = JSON.parse(
      localStorage.getItem('academicYear') as string
    ) as AcademicYear;
    return this.apiService.get<any>(
      `/Diplomas/ElectronicSealForeigner/${id}?academicYearId=${academicYear.id}&isReportAll=${allReports}`,
      new HttpParams(),
      'blob'
    );
  }

  printElectronicSeal(
    studentId: string,
    academicYearId: number,
    allReports: boolean
  ): Observable<ApiResult<any>> {
    return this.apiService.post<ApiResult<any>, any>(
      `/Diplomas/ElectronicSeal/${studentId}?academicYearId=${academicYearId}&isReportAll=${allReports}`,
      {}
    );
  }

  printAllElectronicSeal(data: string): Observable<any> {
    return this.apiService.get<any>(
      `/Diplomas/GenerateElectronicSealDiplomasPdf${data}`,
      new HttpParams()
    );
  }

  exportAllDiplomas(data: string): Observable<BlobPart> {
    return this.apiService.get<any>(
      `/Diplomas/GenerateDiplomasPdf${data}`,
      new HttpParams(),
      'blob'
    );
  }

  loadDiplomas(event: TableLazyLoadEvent): Observable<any> {
    return this.apiService.post(`/Diplomas/TableData`, event).pipe(
      map((data: any) => data),
      catchError(error => throwError(error))
    );
  }

  getStudentSealSummary(): Observable<DiplomaStatusData> {
    return this.apiService.get<any>(`/Diplomas/GetStudentSealSummary`);
  }

  generateDiplomas(): Observable<any> {
    return this.apiService.post(`/Diplomas/GenerateDiplomas`);
  }
}
