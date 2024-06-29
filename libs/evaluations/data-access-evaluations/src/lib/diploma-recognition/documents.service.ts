import { Injectable } from '@angular/core';
import { ApiResult } from '@msh/shared/data-access-shared';
import {
  DiplomaRecognitionDocuments
} from '@msh/shared/domain-models';
import { APIService } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { Observable } from 'rxjs';

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
      `/DiplomaRecognitionRequestResponseFile/${requestId}/ResponseFiles`,
      responseDocuments
    );
  }

  deleteResponseDocuments(
    requestId: number,
    fileId: number
  ): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<DiplomaRecognitionDocuments>>(
      `/DiplomaRecognitionRequestResponseFile/${requestId}/ResponseFiles/${fileId}`
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
      `/DiplomaRecognitionRequestApplicationFile/${requestId}/ApplicationFiles`,
      responseDocuments
    );
  }

  deleteRequestDocuments(
    requestId: number,
    fileId: number
  ): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<DiplomaRecognitionDocuments>>(
      `/DiplomaRecognitionRequestApplicationFile/${requestId}/ApplicationFiles/${fileId}`
    );
  }

  getResponseFiles(
    requestId: number,
    event: TableLazyLoadEvent
  ): Observable<any> {
    return this.apiService.post(
      `/DiplomaRecognitionRequestResponseFile/${requestId}/ResponseFiles/TableData`,
      event
    );
  }

  getOneResponseFile(requestId: number, fileId: number): Observable<any> {
    return this.apiService.get(
      `/DiplomaRecognitionRequestResponseFile/${requestId}/ResponseFiles/${fileId}`
    );
  }

  getOneRequestFile(requestId: number, fileId: number): Observable<any> {
    return this.apiService.get(
      `/DiplomaRecognitionRequestApplicationFile/${requestId}/ApplicationFiles/${fileId}`
    );
  }

  getRequestFiles(
    requestId: number,
    event: TableLazyLoadEvent
  ): Observable<any> {
    return this.apiService.post(
      `/DiplomaRecognitionRequestApplicationFile/${requestId}/ApplicationFiles/TableData`,
      event
    );
  }
}
