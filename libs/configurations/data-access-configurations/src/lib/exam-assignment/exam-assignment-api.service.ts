import { Injectable } from '@angular/core';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { catchError, map, Observable, shareReplay, throwError } from 'rxjs';
import {
  ExamAssignmentImportCommand,
  FileImport,
} from '@msh/configurations/domain-configurations';
import {
  ExamAssignment,
  ExamAssignmentTableView,
} from '@msh/shared/domain-models';
import { LazyLoadEvent } from 'primeng/api';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ExamAssignmentApiService {
  constructor(private apiService: APIService) {}

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

  import(
    command: ExamAssignmentImportCommand
  ): Observable<ApiResult<ExamAssignmentImportCommand>> {
    return this.apiService.post<
      ApiResult<ExamAssignmentImportCommand>,
      ExamAssignmentImportCommand
    >(`/ExamAssignment/Import`, command);
  }

  update(
    examAssignment: ExamAssignment
  ): Observable<ApiResult<ExamAssignment>> {
    return this.apiService.put<ApiResult<ExamAssignment>, ExamAssignment>(
      `/ExamAssignment`,
      examAssignment
    );
  }

  delete(examAssignmentId: string): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<ExamAssignment>>(
      `/ExamAssignment/${examAssignmentId}`
    );
  }

  export(): Observable<ApiResult<unknown>> {
    return this.apiService.get<any>(
      `/ExamAssignment/Export`,
      new HttpParams(),
      'blob'
    );
  }

  emptySite(examDateId: number): Observable<ApiResult<ExamAssignment>> {
    return this.apiService.post(`/ExamAssignment/EmptySite`, {
      examDateId: examDateId,
    });
  }

  examAssign(
    examSiteIds: string[],
    examDateIds: string[]
  ): Observable<ApiResult<ExamAssignment>> {
    return this.apiService.post(`/ExamAssignment/ExamAssign`, {
      examSiteIds: examSiteIds,
      examDateIds: examDateIds,
    });
  }

  forExamDateId(examDateId: number): Observable<ApiResult<ExamAssignment[]>> {
    return this.apiService.get(`/ExamAssignment/forExamDateId/${examDateId}`);
  }
}
