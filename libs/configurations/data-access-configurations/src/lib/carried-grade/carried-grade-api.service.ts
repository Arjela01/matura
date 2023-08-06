import { Injectable } from '@angular/core';
import {
  CarriedGrade,
  CarriedGradeTable,
} from '@msh/applications/domain-application';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { map, Observable } from 'rxjs';

import * as FileSaver from 'file-saver';
import { ExamGrade } from '@msh/shared/domain-models';

@Injectable({
  providedIn: 'root',
})
export class CarriedGradeApiService {
  constructor(private apiService: APIService) {}

  loadCarriedGrades(event: TableLazyLoadEvent): Observable<CarriedGradeTable> {
    return this.apiService.post(`/CarriedGrade/TableData`, event).pipe(
      map(x => {
        console.log(x);
        return x as CarriedGradeTable;
      })
    );
  }

  save(carriedGrade: CarriedGrade): Observable<ApiResult<CarriedGrade>> {
    return this.apiService.post<ApiResult<CarriedGrade>, CarriedGrade>(
      `/CarriedGrade`,
      carriedGrade
    );
  }

  update(carriedGrade: CarriedGrade): Observable<ApiResult<CarriedGrade>> {
    return this.apiService.put<ApiResult<CarriedGrade>, CarriedGrade>(
      `/CarriedGrade`,
      carriedGrade
    );
  }

  delete(carriedGrade: number | undefined): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<CarriedGrade>>(
      `/CarriedGrade/${carriedGrade}`
    );
  }

  downloadDocument(carriedGrade: CarriedGrade) {
    if (!carriedGrade.document) return;

    const byteCharacters = atob(carriedGrade.document);
    const header = byteCharacters.substring(0, 4);
    let extension = '';
    switch (header) {
      case '%PDF':
        extension = 'pdf';
        break;
      case 'PK\x03\x04':
        extension = 'docx';
        break;
      case 'MIME':
        extension = 'txt';
        break;
      case 'PK\x07\x08':
        extension = 'xlsx';
        break;
      case '\x89PNG':
        extension = 'png';
        break;
      case '\xFF\xD8\xFF\xE0':
      case '\xFF\xD8\xFF\xE1':
        extension = 'jpeg';
        break;
    }

    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/octet-stream' });

    FileSaver.saveAs(blob, `document.${extension}`);
  }

  getByStudentId(
    id: string,
    type: string
  ): Observable<ApiResult<CarriedGrade[]>> {
    return this.apiService.get(`/CarriedGrade/ForStudentId/${id}/${type}`);
  }

  ensureExamGradeIsCarried(
    examGrade: ExamGrade
  ): Observable<ApiResult<CarriedGrade>> {
    return this.apiService.post(
      `/CarriedGrade/EnsureExamGradeIsCarried/${examGrade.id}`
    );
  }
}
