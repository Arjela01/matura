import {Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {ExamResult} from "@msh/evaluations/domain-evaluations";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class ExamResultApiService {
  constructor(private http: HttpClient) {
  }

  loadExamResults(): Observable<any> {
    return this.http.get('assets/demo/data/exam-result.json');
  }

}

