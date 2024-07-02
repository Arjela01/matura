import { Inject, Injectable } from '@angular/core';
import { ApiResult } from '@msh/shared/data-access-shared';
import { API_URL, APIService } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  ExamCopy,
  ExamCopyTableView,
  ExamCopyUpdate,
} from '@msh/shared/domain-models';

@Injectable({
  providedIn: 'root',
})
export class ExamCopyApiService {
  constructor(
    private apiService: APIService,
    private http: HttpClient,
    @Inject(API_URL) private api_url: string
  ) {}

  loadExamCopies(event: TableLazyLoadEvent): Observable<ExamCopyTableView> {
    return this.apiService.post(`/ExamCopyRequest/TableData`, event);
  }

  update(body: ExamCopyUpdate): Observable<ApiResult<ExamCopyUpdate>> {
    return this.apiService.post(`/ExamCopyRequest/Update`, body);
  }

  getById(applicationId: string): Observable<ApiResult<ExamCopy>> {
    return this.apiService.get(`/ExamCopyRequest/GetById/${applicationId}`);
  }

  exportTemplate(): Observable<ApiResult<unknown>> {
    return this.apiService.get<any>(
      `/ExamCopyRequest/Export`,
      new HttpParams(),
      'blob'
    );
  }

  uploadFile(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    const url = `${this.api_url}/ExamCopyRequest/UploadFiles`;

    return this.http.post(url, formData, {
      headers: new HttpHeaders({
        Accept: 'application/json',
      }),
      reportProgress: true,
      observe: 'events',
    });
  }

  downloadAttachment(id?: string) {
    return this.apiService.get<any>(
      `/ExamCopyRequest/DownloadAttachment/${id}`,
      new HttpParams(),
      'blob'
    );
  }
}
