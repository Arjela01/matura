import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Observable} from 'rxjs';
import {LazyLoadEvent} from "primeng/api";
import {environment} from "@msh/shared/environments";

@Injectable({
  providedIn: 'root',
})
export class ExamTypeApiService {
  constructor(private http: HttpClient) {
  }

  loadExamTypes(event: LazyLoadEvent): Observable<any> {
    return this.http.post(`${environment.api_url}/ /TableData`, event)
  }


  // loadDummyExamTypes(): Observable<ExamType[]> {
  //   return this.http
  //     .get<{ data: ExamType[] }>('assets/demo/data/exam-type.json')
  //     .pipe(
  //       map(response => {
  //         return response.data as ExamType[];
  //       })
  //     );
  // }
}
