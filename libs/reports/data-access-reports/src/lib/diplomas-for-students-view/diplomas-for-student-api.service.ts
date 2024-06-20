import { Injectable } from '@angular/core';
import { APIService } from '@msh/shared/util-shared';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DiplomasForStudentApiService {
  constructor(private apiService: APIService) {}

  getDiplomaForStudentById(id: string): Observable<any> {
    return this.apiService.get(
      `/Diplomas/PrintForStudentId/${id}`,
      new HttpParams(),
      'blob'
    );
  }

  getSealedDiplomaForStudentById(id: string): Observable<any> {
    return this.apiService.get(
      `/Diplomas/PrintSealedForStudentId/${id}`,
      new HttpParams(),
      'blob'
    );
  }
}
