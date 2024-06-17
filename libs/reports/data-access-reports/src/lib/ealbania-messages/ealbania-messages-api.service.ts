import { Injectable } from '@angular/core';
import { APIService } from '@msh/shared/util-shared';
import { Observable } from 'rxjs';
import { TableLazyLoadEvent } from 'primeng/table';

@Injectable({
  providedIn: 'root',
})
export class EalbaniaMessagesApiService {
  constructor(private apiService: APIService) {}

  loadData(filter: TableLazyLoadEvent): Observable<any> {
    return this.apiService.post(`/EAlbaniaMessage/TableData`, filter);
  }

  generateGradeMessages() {
    return this.apiService.post(`/EAlbaniaMessage/GenerateGradeMessages`);
  }

  approveGradeMessages() {
    return this.apiService.post(`/EAlbaniaMessage/ApproveGradeMessages`);
  }

  deleteGradeMessages() {
    return this.apiService.post(`/EAlbaniaMessage/DeleteGradeMessages`);
  }

  loadFakeReceiver(): Observable<any> {
    return this.apiService.get(`/GGFakeReceiver`);
  }
}
