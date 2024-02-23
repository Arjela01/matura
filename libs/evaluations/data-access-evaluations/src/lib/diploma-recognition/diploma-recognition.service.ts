import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TableLazyLoadEvent } from 'primeng/table';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import {
  DiplomaRecognition,
  DiplomaRecognitionView,
} from '@msh/shared/domain-models';

@Injectable({
  providedIn: 'root',
})
export class DiplomaRecognitionService {
  constructor(private apiService: APIService) {}

  loadData(event: TableLazyLoadEvent): Observable<DiplomaRecognitionView> {
    return this.apiService.post(`/DiplomaRecognitionRequest/TableData`, event);
  }

  save(
    diplomaRecognition: DiplomaRecognition
  ): Observable<ApiResult<DiplomaRecognition>> {
    return this.apiService.post<
      ApiResult<DiplomaRecognition>,
      DiplomaRecognition
    >(`/DiplomaRecognitionRequest`, diplomaRecognition);
  }

  update(
    diplomaRecognition: DiplomaRecognition
  ): Observable<ApiResult<DiplomaRecognition>> {
    return this.apiService.post<
      ApiResult<DiplomaRecognition>,
      DiplomaRecognition
    >(`/DiplomaRecognitionRequest/Update`, diplomaRecognition);
  }

  delete(diplomaRecognitionId: string): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<DiplomaRecognition>>(
      `/DiplomaRecognitionRequest/${diplomaRecognitionId}`
    );
  }

  getOneRecord(diplomaRecognitionId: number): Observable<ApiResult<any>> {
    return this.apiService.get<ApiResult<DiplomaRecognition>>(
      `/DiplomaRecognitionRequest/${diplomaRecognitionId}`
    );
  }

  getStatus(): Observable<ApiResult<DropdownModel<string>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<string>[]>>(
      `/DiplomaRecognitionRequestStatus/DropdownList`
    );
  }
}
