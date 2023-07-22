import { Injectable } from '@angular/core';
import { APIService } from '@msh/shared/util-shared';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataExportApiService {
  constructor(private apiService: APIService) {}

  loadDataExports(): Observable<any> {
    return this.apiService.post(`/DataExport`, event);
  }

  export(id: number): Observable<any> {
    return this.apiService.post(`/DataExport/Export/${id}`, event);
  }
}
