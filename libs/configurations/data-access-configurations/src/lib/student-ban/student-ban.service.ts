import { Injectable } from '@angular/core';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { Observable } from 'rxjs';
import { TableLazyLoadEvent } from 'primeng/table';
import { StudentBan, StudentBanTableView } from '@msh/shared/domain-models';

@Injectable({
  providedIn: 'root',
})
export class StudentBanApiService {
  constructor(private apiService: APIService) {}

  loadDropdownList(): Observable<ApiResult<DropdownModel<number>[]>> {
    return this.apiService.get<ApiResult<DropdownModel<number>[]>>(
      `/StudentBan/DropdownList`
    );
  }
  loadBannedStudents(
    event: TableLazyLoadEvent
  ): Observable<StudentBanTableView> {
    return this.apiService.post(`/StudentBan/TableData`, event);
  }

  save(studentBan: StudentBan): Observable<ApiResult<StudentBan>> {
    return this.apiService.post<ApiResult<StudentBan>, StudentBan>(
      `/StudentBan`,
      studentBan
    );
  }

  update(studentBan: StudentBan): Observable<ApiResult<StudentBan>> {
    return this.apiService.post<ApiResult<StudentBan>, StudentBan>(
      `/StudentBan/Update`,
      studentBan
    );
  }

  delete(studentBanId: number): Observable<ApiResult<unknown>> {
    return this.apiService.delete<ApiResult<StudentBan>>(
      `/StudentBan/${studentBanId}`
    );
  }
}
