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
import { TableLazyLoadEvent } from 'primeng/table';
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
    event: TableLazyLoadEvent
  ): Observable<ExamAssignmentTableView> {
    return this.apiService.post(`/ExamAssignment/TableData`, event);
  }
  getAssignments(
    event: TableLazyLoadEvent
  ): Observable<ExamAssignmentTableView> {
    return this.apiService.post(`/ExamAssignment/AssigmentsTableData`, event);
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
    return this.apiService.post<ApiResult<ExamAssignment>, ExamAssignment>(
      `/ExamAssignment/Update`,
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
