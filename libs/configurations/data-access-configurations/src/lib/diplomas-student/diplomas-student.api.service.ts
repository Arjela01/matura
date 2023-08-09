import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AcademicYear } from '@msh/shared/domain-models';
import { APIService } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DiplomasStudentApiService {
  constructor(private apiService: APIService) {}

  exportDiplomasStudent(id: string, allReports: boolean): Observable<BlobPart> {
    const academicYear = JSON.parse(
      localStorage.getItem('academicYear') as string
    ) as AcademicYear;
    return this.apiService.put<BlobPart, any>(
      `/PrintedDiplomas/${id}?academicYearId=${academicYear.id}&isReportAll=${allReports}`,
      {},
      'blob'
    );
  }
  exportAllDiplomas(data: string): Observable<BlobPart> {
    return this.apiService.get<any>(
      `/PrintedDiplomas/GenerateDiplomasPdf${data}`,
      new HttpParams(),
      'blob'
    );
  }

  loadStudentDiplomas(event: TableLazyLoadEvent): Observable<any> {
    return this.apiService.post(`/PrintedDiplomas/TableData`, event).pipe(
      map((data: any) => data),
      catchError(error => throwError(error))
    );
  }
}
