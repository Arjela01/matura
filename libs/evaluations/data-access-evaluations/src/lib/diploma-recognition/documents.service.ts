import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import {
  DiplomaRecognitionDocuments,
  DiplomaRecognitionView,
} from '@msh/shared/domain-models';
import { TableLazyLoadEvent } from 'primeng/table';

@Injectable({
  providedIn: 'root',
})
export class DiplomaRecognitionDocumentsService {
  constructor(private apiService: APIService) {}

  addResponseDocuments(
    responseDocuments: DiplomaRecognitionDocuments,
    requestId: number
  ): Observable<ApiResult<DiplomaRecognitionDocuments>> {
    return this.apiService.post<
      ApiResult<DiplomaRecognitionDocuments>,
      DiplomaRecognitionDocuments
    >(
      `/DiplomaRecognitionRequest/${requestId}/ResponseFiles`,
      responseDocuments
    );
  }

  deleteResponseDocuments(
    requestId: number,
    fileId: number
  ): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<DiplomaRecognitionDocuments>>(
      `/DiplomaRecognitionRequest/${requestId}/ResponseFiles/${fileId}`
    );
  }

  addRequestDocuments(
    responseDocuments: DiplomaRecognitionDocuments,
    requestId: number
  ): Observable<ApiResult<DiplomaRecognitionDocuments>> {
    return this.apiService.post<
      ApiResult<DiplomaRecognitionDocuments>,
      DiplomaRecognitionDocuments
    >(
      `/DiplomaRecognitionRequest/${requestId}/ApplicationFiles`,
      responseDocuments
    );
  }

  deleteRequestDocuments(
    requestId: number,
    fileId: number
  ): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<DiplomaRecognitionDocuments>>(
      `/DiplomaRecognitionRequest/${requestId}/ApplicationFiles/${fileId}`
    );
  }

  getResponseFiles(
    requestId: number,
    event: TableLazyLoadEvent
  ): Observable<any> {
    return this.apiService.post(
      `/DiplomaRecognitionRequest/${requestId}/ResponseFiles/TableData`,
      event
    );
  }

  getOneResponseFile(requestId: number, fileId: number): Observable<any> {
    return this.apiService.get(
      `/DiplomaRecognitionRequest/${requestId}/ResponseFiles/${fileId}`
    );
  }

  getOneRequestFile(requestId: number, fileId: number): Observable<any> {
    return this.apiService.get(
      `/DiplomaRecognitionRequest/${requestId}/ApplicationFiles/${fileId}`
    );
  }

  getRequestFiles(
    requestId: number,
    event: TableLazyLoadEvent
  ): Observable<any> {
    return this.apiService.post(
      `/DiplomaRecognitionRequest/${requestId}/ApplicationFiles/TableData`,
      event
    );
  }
}
