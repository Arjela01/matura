import { Injectable } from '@angular/core';
import { APIService } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { catchError, map, Observable, throwError } from 'rxjs';
import { SharedStudent } from '../models/shared-student';

@Injectable({
  providedIn: 'root',
})
export class SharedStudentApiService {
  constructor(private apiService: APIService) {}

  loadStudents(event: LazyLoadEvent): Observable<SharedStudent> {
    return this.apiService.post(`/Student/TableData`, event).pipe(
      map((data: any) => data),
      catchError(error => throwError(error))
    );
  }
}
