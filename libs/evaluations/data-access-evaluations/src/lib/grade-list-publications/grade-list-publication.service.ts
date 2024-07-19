import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIService } from '@msh/shared/util-shared';

import { TableLazyLoadEvent } from 'primeng/table';
import {
  GradeListPublicationCurrentRecordView,
  GradeListPublicationView,
} from '@msh/shared/domain-models';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GradeListPublicationService {
  constructor(
    private apiService: APIService,
    private httpClient: HttpClient
  ) {}

  loadDataGradeListPublications(
    event: TableLazyLoadEvent
  ): Observable<GradeListPublicationView> {
    return this.apiService.post(`/GradeListPublication/TableData`, event);
  }

  loadDataGradeListPublicationCurrentRecords(
    event: TableLazyLoadEvent
  ): Observable<GradeListPublicationCurrentRecordView> {
    return this.apiService.post(
      `/GradeListPublication/CurrentRecordsTableData`,
      event
    );
  }

  loadDataGradeListPublicationDiffRecords(
    gradePublicationListId: string,
    event: TableLazyLoadEvent
  ): Observable<GradeListPublicationCurrentRecordView> {
    return this.apiService.post(
      `/GradeListPublication/${gradePublicationListId}/DiffRecordsTableData`,
      event
    );
  }

  generateNewPublication(): Observable<any> {
    return this.apiService.post(`/GradeListPublication/GenerateNewPublication`);
  }

  publish(id: any) {
    return this.apiService.post(`/GradeListPublication/Publish/${id}`);
  }

  delete(id: any) {
    return this.apiService.post(`/GradeListPublication/Delete/${id}`);
  }

  download(id: number) {
    return this.httpClient.get(
      this.apiService.resolveUrl(`/GradeListPublication/Download/${id}`),
      {
        responseType: 'blob',
        observe: 'response',
      }
    );
  }

  downloadProfiles() {
    return this.httpClient.get(
      this.apiService.resolveUrl(`/GradeListPublication/DownloadProfiles`),
      {
        responseType: 'blob',
        observe: 'response',
      }
    );
  }
}
