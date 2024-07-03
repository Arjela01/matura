import { Injectable } from '@angular/core';
import { APIService } from '@msh/shared/util-shared';
import { interval, Observable, retry, share, startWith, switchMap } from 'rxjs';
import { TableLazyLoadEvent } from 'primeng/table';

@Injectable({
  providedIn: 'root',
})
export class EalbaniaMessagesApiService {
  constructor(private apiService: APIService) {}

  loadData(filter: TableLazyLoadEvent): Observable<any> {
    return this.apiService.post(`/EAlbaniaMessage/TableData`, filter);
  }

  getStatistics(): Observable<any> {
    return interval(5000).pipe(
      startWith(0),
      switchMap(() => this.apiService.get('/EAlbaniaMessage/GetStats')),
      retry(),
      share()
    );
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

  approveMessage(id: any): Observable<any> {
    return this.apiService.post(`/EAlbaniaMessage/Approve/${id}`);
  }

  deleteMessage(id: any): Observable<any> {
    return this.apiService.post(`/EAlbaniaMessage/Delete/${id}`);
  }
}
