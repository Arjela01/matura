import { Injectable } from '@angular/core';
import {
  ExamGrade,
  Student,
  StudentTableView,
} from '@msh/shared/domain-models';
import { APIService } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { Observable } from 'rxjs';
import { ApiResult } from '@msh/shared/data-access-shared';

@Injectable({
  providedIn: 'root',
})
export class StudentsAuditService {
  constructor(private apiService: APIService) {}

  loadStudents(event: TableLazyLoadEvent): Observable<StudentTableView> {
    return this.apiService.post(`/StudentHistory/TableDataHistory`, event);
  }
  getStudentsById(nid: string): Observable<ApiResult<Student>> {
    const url = `/StudentHistory/StudentDetail/${nid}`;
    return this.apiService.get<ApiResult<Student>>(url);
  }
  getStudentsGradesByNid(nid: any): Observable<ApiResult<ExamGrade[]>> {
    const url = `/StudentHistory/GradeDetail/${nid}`;
    return this.apiService.get<ApiResult<ExamGrade[]>>(url);
  }
}
