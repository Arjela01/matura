import { Injectable } from '@angular/core';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { Observable } from 'rxjs';
import { EmptySite, EmptySiteTableView } from '@msh/shared/domain-models';
import { TableLazyLoadEvent } from 'primeng/table';

@Injectable({
  providedIn: 'root',
})
export class EmptySiteApiService {
  constructor(private apiService: APIService) {}

  loadEmptySite(event: TableLazyLoadEvent): Observable<EmptySiteTableView> {
    return this.apiService.post(`/ExamAssignment/TakenSeats`, event);
  }

  emptySite(examDateId: number): Observable<ApiResult<EmptySite>> {
    return this.apiService.post(`/ExamAssignment/EmptySite`, {
      examDateId: examDateId,
    });
  }
}
