import { Injectable } from '@angular/core';
import { catchError, map, Observable, shareReplay, throwError } from 'rxjs';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { HttpParams } from '@angular/common/http';
import {ArchiveExam, ExamScore, ExamScoreTableView, FileImport} from '@msh/shared/domain-models';
import {LazyLoadEvent} from "primeng/api";

@Injectable({
  providedIn: 'root',
})
export class ExamScoreApiService {
  constructor(private apiService: APIService) {}

  loadExamScores(event: any): Observable<any> {
    return this.apiService.post(`/ExamScores/TableData`, event);
  }

  save(examScore: ExamScore): Observable<ApiResult<ExamScore>> {
    return this.apiService.post<ApiResult<ExamScore>, ExamScore>(
      `/ExamScores`,
      examScore
    );
  }

  update(examScore: ExamScore): Observable<ApiResult<ExamScore>> {
    return this.apiService.put<ApiResult<ExamScore>, ExamScore>(
      `/ExamScores`,
      examScore
    );
  }

  delete(examScoreId: number): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<ExamScore>>(
      `/ExamScores/${examScoreId}`
    );
  }

  getIndex(barcode: string): Observable<ApiResult<ArchiveExam>> {
    return this.apiService.post<ApiResult<ArchiveExam>, any>(
      `/ExamScores/GetIndex`,
      { barcode: barcode }
    );
  }

  uploadExcelFile(
    base64: string | ArrayBuffer | null
  ): Observable<ApiResult<unknown>> {
    return this.apiService
      .post<ApiResult<FileImport>, FileImport>('/ExamScores/Import', {
        file: base64,
      })
      .pipe(
        map(data => data),
        catchError(error => throwError(error)),
        shareReplay()
      );
  }

  export(): Observable<ApiResult<unknown>> {
    return this.apiService.get<any>(
      `/ExamScores/Export`,
      new HttpParams(),
      'blob'
    );
  }

  exportExamScoreSecret(): Observable<ApiResult<unknown>> {
    return this.apiService.get<any>(
      `/ExamScores/ExportExamScoreSecret`,
      new HttpParams(),
      'blob'
    );
  }

  loadUnmatchedExamScores(
      event: LazyLoadEvent
  ): Observable<ExamScoreTableView> {
    return this.apiService.post(`/ExamScores/UnmatchedExams`, event).pipe(
        map((data: any) => data),
        catchError(error => throwError(error))
    );
  }

  loadMatchedExamScores(
      event: LazyLoadEvent
  ): Observable<ExamScoreTableView> {
    return this.apiService.post(`/ExamScores/MatchedExams`, event).pipe(
        map((data: any) => data),
        catchError(error => throwError(error))
    );
  }
}
