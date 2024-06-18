import { Injectable } from '@angular/core';
import { APIService } from '@msh/shared/util-shared';
import { catchError, map, Observable, throwError } from 'rxjs';
import { TableLazyLoadEvent } from 'primeng/table';
import { StudentTableView } from '@msh/shared/domain-models';

@Injectable({
  providedIn: 'root',
})
export class DiplomasForStudentApiService {
  constructor(private apiService: APIService) {}

  getDiplomasForStudentById(id: string): Observable<any> {
    return this.apiService.get(`/DiplomasHistory/${id}`);
  }

  // sendDiplomaToSeal(event: TableLazyLoadEvent): Observable<StudentTableView> {
  //   return this.apiService.post(`/AverageGrade/TableData`, event).pipe(
  //     map((data: any) => data),
  //     catchError(error => throwError(error))
  //   );
  // }
}
