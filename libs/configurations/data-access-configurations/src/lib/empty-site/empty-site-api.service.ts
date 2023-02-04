import { Injectable } from '@angular/core';
import { ApiResult } from '@msh/shared/data-access-shared';
import { APIService } from '@msh/shared/util-shared';
import { Observable } from 'rxjs';
import {LazyLoadEvent} from "primeng/api";
import {ExamSite, ExamSiteTableView} from "@msh/configurations/domain-configurations";


@Injectable({
  providedIn: 'root',
})
export class EmptySiteApiService {
  constructor(private apiService: APIService) {}

  loadExamSites(event: LazyLoadEvent): Observable<ExamSiteTableView> {
    return this.apiService.post(`/ExamSite/TableData`, event);
  }
  emptySite(examSiteId: number): Observable<ApiResult<ExamSite>>{
    return this.apiService.post(`/ExamSite/EmptySite/${examSiteId}`)
  }
}
