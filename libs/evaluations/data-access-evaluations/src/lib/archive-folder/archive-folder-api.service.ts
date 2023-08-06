import { Injectable } from '@angular/core';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  ArchiveFolder,
  ArchiveFolderTableView,
  BarcodeCorrectionTableView,
} from '@msh/shared/domain-models';

@Injectable({
  providedIn: 'root',
})
export class ArchiveFolderApiService {
  currentArchiveFolder$: BehaviorSubject<ArchiveFolder | null> =
    new BehaviorSubject<ArchiveFolder | null>(null);

  constructor(private apiService: APIService) {}

  getById(id: any): Observable<ApiResult<ArchiveFolder>> {
    return this.apiService.get<ApiResult<ArchiveFolder>>(
      `/ArchiveFolder/${id}`
    );
  }

  // barcodeCorrection(
  //   Nr:  TableLazyLoadEvent,
  //   ExamTypeName:  TableLazyLoadEvent,
  // ):Observable<ApiResult<ArchiveFolder>> {
  //   return this.apiService.post<ApiResult<ArchiveFolder>, ArchiveFolder>(
  //     `/ArchiveFolder/BarcodeCorrection/${Nr},${ExamTypeName}`,
  //   );
  // }

  barcodeCorrection(
    event: TableLazyLoadEvent
  ): Observable<BarcodeCorrectionTableView> {
    return this.apiService.post(`/ArchiveFolder/BarcodeCorrection`, event);
  }

  changeFolderStatus(
    id: number,
    isClosed?: boolean
  ): Observable<ApiResult<ArchiveFolder>> {
    return this.apiService.put<ApiResult<ArchiveFolder>, any>(
      `/ArchiveFolder/UpdateStatus`,
      {
        id: id,
        isClosed: !isClosed,
      }
    );
  }
  loadDropdownList(): Observable<ApiResult<DropdownModel<any>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<any>[]>>(
      '/ArchiveFolder/DropdownList'
    );
  }
  loadDropdownListForExamType(
    examTypeId: string
  ): Observable<ApiResult<DropdownModel<any>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<any>[]>>(
      `/ArchiveFolder/DropdownList/${examTypeId}`
    );
  }

  loadArchiveFolder(event: TableLazyLoadEvent): Observable<ArchiveFolderTableView> {
    return this.apiService.post(`/ArchiveFolder/TableData`, event);
  }

  save(archiveFolder: ArchiveFolder): Observable<ApiResult<ArchiveFolder>> {
    return this.apiService.post<ApiResult<ArchiveFolder>, ArchiveFolder>(
      `/ArchiveFolder`,
      archiveFolder
    );
  }

  update(archiveFolder: ArchiveFolder): Observable<ApiResult<ArchiveFolder>> {
    return this.apiService.put<ApiResult<ArchiveFolder>, ArchiveFolder>(
      `/ArchiveFolder`,
      archiveFolder
    );
  }

  delete(barcodeId: number): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<ArchiveFolder>>(
      `/ArchiveFolder/${barcodeId}`
    );
  }
}
