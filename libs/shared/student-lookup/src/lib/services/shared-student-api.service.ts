import { Injectable } from '@angular/core';
import { APIService } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { catchError, map, Observable, throwError } from 'rxjs';
import { SharedStudent } from '../models/shared-student';

@Injectable({
  providedIn: 'root',
})
export class SharedStudentApiService {
  constructor(private apiService: APIService) {}

  loadStudents(event: TableLazyLoadEvent): Observable<SharedStudent> {
    return this.apiService.post(`/Student/TableData`, event).pipe(
      map((data: any) => data),
      catchError(error => throwError(error))
    );
  }
}
