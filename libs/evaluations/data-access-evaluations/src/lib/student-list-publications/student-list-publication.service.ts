import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIService } from '@msh/shared/util-shared';

import { TableLazyLoadEvent } from 'primeng/table';
import {
  StudentListPublicationCurrentRecordView,
  StudentListPublicationView,
} from '@msh/shared/domain-models';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class StudentListPublicationService {
  constructor(
    private apiService: APIService,
    private httpClient: HttpClient
  ) {}

  loadDataStudentListPublications(
    event: TableLazyLoadEvent
  ): Observable<StudentListPublicationView> {
    return this.apiService.post(`/StudentListPublication/TableData`, event);
  }

  loadDataStudentListPublicationCurrentRecords(
    event: TableLazyLoadEvent
  ): Observable<StudentListPublicationCurrentRecordView> {
    return this.apiService.post(
      `/StudentListPublication/CurrentRecordsTableData`,
      event
    );
  }

  loadDataStudentListPublicationDiffRecords(
    studentPublicationListId: string,
    event: TableLazyLoadEvent
  ): Observable<StudentListPublicationCurrentRecordView> {
    return this.apiService.post(
      `/StudentListPublication/${studentPublicationListId}/DiffRecordsTableData`,
      event
    );
  }

  generateNewPublication(): Observable<any> {
    return this.apiService.post(
      `/StudentListPublication/GenerateNewPublication`
    );
  }

  publish(id: any) {
    return this.apiService.post(`/StudentListPublication/Publish/${id}`);
  }

  delete(id: any) {
    return this.apiService.post(`/StudentListPublication/Delete/${id}`);
  }

  download(id: number) {
    return this.httpClient.get(
      this.apiService.resolveUrl(`/StudentListPublication/Download/${id}`),
      {
        responseType: 'blob',
        observe: 'response',
      }
    );
  }
}
