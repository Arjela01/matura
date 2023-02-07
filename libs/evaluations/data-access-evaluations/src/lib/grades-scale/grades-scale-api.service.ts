import { Injectable } from '@angular/core';
import {
  GradesScale,
  GradesScaleTableView,
} from '@msh/evaluations/domain-evaluations';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GradesScaleService {
  constructor(private apiService: APIService) {}

  loadGradesScale(event: LazyLoadEvent): Observable<GradesScaleTableView> {
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

  delete(gradeId: number | undefined): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<GradesScale>>(
      `/GradeScale/${gradeId}`
    );
  }

  //   uploadExcelFile(
  //     base64: string | ArrayBuffer | null
  //   ): Observable<ApiResult<unknown>> {
  //     return this.apiService
  //       .post<ApiResult<FileImport>, FileImport>('/api/ExamSecrets/Import', {
  //         file: base64,
  //       })
  //       .pipe(
  //         map(data => data),
  //         catchError(error => throwError(error)),
  //         shareReplay()
  //       );
  //   }
}
