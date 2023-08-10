import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { catchError, map, Observable, shareReplay, throwError } from 'rxjs';
import { GradesScale, GradesScaleTableView } from '@msh/shared/domain-models';

@Injectable({
  providedIn: 'root',
})
export class GradesScaleService {
  constructor(private apiService: APIService) {}

  loadGradesScale(event: TableLazyLoadEvent): Observable<GradesScaleTableView> {
    return this.apiService.post(`/GradeScale/TableData`, event);
  }

  save(gradeScale: GradesScale): Observable<ApiResult<GradesScale>> {
    return this.apiService.post<ApiResult<GradesScale>, GradesScale>(
      `/GradeScale`,
      gradeScale
    );
  }

  update(gradeScale: GradesScale): Observable<ApiResult<GradesScale>> {
    return this.apiService.put<ApiResult<GradesScale>, GradesScale>(
      `/GradeScale`,
      gradeScale
    );
  }

  getScale(id: string): Observable<ApiResult<GradesScale[]>> {
    return this.apiService.get(`/GradeScale/${id}`);
  }

  delete(gradeId: string | undefined): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<GradesScale>>(
      `/GradeScale/${gradeId}`
    );
  }

  export(): Observable<ApiResult<unknown>> {
    return this.apiService.get<any>(
      `/GradeScale/ExportTemplate`,
      new HttpParams(),
      'blob'
    );
  }
  uploadExcelFile(data: any): Observable<ApiResult<unknown>> {
    return this.apiService
      .post<ApiResult<any>, any>('/GradeScale/Import', {
        file: data.file,
        examTypeId: data.examTypeId,
      })
      .pipe(
        map(data => data),
        catchError(error => throwError(error)),
        shareReplay()
      );
  }
}
