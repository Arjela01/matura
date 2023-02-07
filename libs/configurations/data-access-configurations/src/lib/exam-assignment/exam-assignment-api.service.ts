import { Injectable } from '@angular/core';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { catchError, map, Observable, shareReplay, throwError } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { FileImport } from '@msh/evaluations/domain-evaluations';
import {ExamAssignment, ExamAssignmentTableView} from "@msh/shared/domain-models";

@Injectable({
  providedIn: 'root',
})
export class ExamAssignmentApiService {
  constructor(private apiService: APIService) {}

  // getById(id: any): Observable<ApiResult<ExamAssignment>> {
  //   return this.apiService.get<ApiResult<ExamAssignment>>(
  //     `/ExamAssignment/${id}`
  //   );
  // }

  loadDropdownList(): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<number>[]>>(
      `/ExamAssignment/DropdownList`
    );
  }
  loadExamAssignments(
    event: LazyLoadEvent
  ): Observable<ExamAssignmentTableView> {
    return this.apiService.post(`/ExamAssignment/TableData`, event);
  }

  save(examAssignment: ExamAssignment): Observable<ApiResult<ExamAssignment>> {
    return this.apiService.post<ApiResult<ExamAssignment>, ExamAssignment>(
      `/ExamAssignment`,
      examAssignment
    );
  }

  update(
    examAssignment: ExamAssignment
  ): Observable<ApiResult<ExamAssignment>> {
    return this.apiService.put<ApiResult<ExamAssignment>, ExamAssignment>(
      `/ExamAssignment`,
      examAssignment
    );
  }

  delete(examAssignmentId: number): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<ExamAssignment>>(
      `/ExamAssignment/${examAssignmentId}`
    );
  }

  uploadExcelFile(
    base64: string | ArrayBuffer | null
  ): Observable<ApiResult<unknown>> {
    return this.apiService
      .post<ApiResult<FileImport>, FileImport>('/ExamAssignment/Import', {
        file: base64,
      })
      .pipe(
        map(data => data),
        catchError(error => throwError(error)),
        shareReplay()
      );
  }
}
