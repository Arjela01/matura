import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DiplomaStatusData } from '@msh/shared/domain-models';
import { APIService } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ApiResult } from '@msh/shared/data-access-shared';

@Injectable({
  providedIn: 'root',
})
export class DiplomasStudentApiService {
  constructor(private apiService: APIService) {}

  print(id: string) {
    return this.apiService.get<any>(
      `/Diplomas/Print/${id}`,
      new HttpParams(),
      'blob'
    );
  }

  printSealed(id: string) {
    return this.apiService.get<any>(
      `/Diplomas/PrintSealed/${id}`,
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

  loadForeginDiplomas(event: TableLazyLoadEvent): Observable<any> {
    return this.apiService.post(`/Diplomas/ForeignTableData`, event).pipe(
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

  sendToEAlbania(approvalCriteria: any): Observable<any> {
    return this.apiService.post(`/Diplomas/SendToEAlbania`, approvalCriteria);
  }

  printForeignDiplomas(): Observable<any> {
    return this.apiService.get(
      `/Diplomas/PrintForeignDiplomas`,
      new HttpParams(),
      'blob'
    );
  }

  sendToEalbaniaByStudentId(studentId: string): Observable<any> {
    return this.apiService.get(
      `/Diplomas/SendToEalbaniaStudentId/${studentId}`
    );
  }
}
