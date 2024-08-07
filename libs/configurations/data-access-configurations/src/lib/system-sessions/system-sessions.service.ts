import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { APIService } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { SystemSessionsView } from '@msh/shared/domain-models';

@Injectable({
  providedIn: 'root',
})
export class SystemSessionsService {
  constructor(private apiService: APIService) {}

  loadSessions(event: TableLazyLoadEvent): Observable<SystemSessionsView> {
    return this.apiService.post(`/SystemSession/TableDataHistory`, event).pipe(
      map((data: any) => data),
      catchError(error => throwError(error))
    );
  }
}
