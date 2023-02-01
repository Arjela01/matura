import { Injectable } from '@angular/core';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { Observable } from 'rxjs';
import {
  AddBarcode, AddBarcodeTableView
} from '@msh/configurations/domain-configurations';

@Injectable({
  providedIn: 'root',
})
export class AddBarcodeApiService {
  constructor(private apiService: APIService) {}

  getById(id: any): Observable<ApiResult<AddBarcode>> {
    return this.apiService.get<ApiResult<AddBarcode>>(
      `/ArchiveExam/${id}`
    );
  }
  changeAddBarcode(
    barcode: AddBarcode
  ): Observable<ApiResult<AddBarcode>> {
    return this.apiService.put<ApiResult<AddBarcode>, any>(
      `/ArchiveExam/UpdateStatus`,
      {
        id: barcode.archiveFolderId,
      }
    );
  }
  loadDropDownList(): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<number>[]>>(
      '/ArchiveExam/DropdownList'
    );
  }

  loadAddBarcode(event: LazyLoadEvent): Observable<AddBarcodeTableView> {
    return this.apiService.post(`/ArchiveExam/TableData`, event);
  }

  save(barcode: AddBarcode): Observable<ApiResult<AddBarcode>> {
    return this.apiService.post<ApiResult<AddBarcode>, AddBarcode>(
      `/ArchiveExam`,
      barcode
    );
  }

  update(barcode: AddBarcode): Observable<ApiResult<AddBarcode>> {
    return this.apiService.put<ApiResult<AddBarcode>, AddBarcode>(
      `/ArchiveExam`,
      barcode
    );
  }

  delete(barcodeId: number): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<AddBarcode>>(
      `/ArchiveExam/${barcodeId}`
    );
  }
}
