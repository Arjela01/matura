import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HighSchool } from '@msh/configurations/domain-configurations';
import { APIService } from '@msh/shared/util-shared';
import { map, Observable } from 'rxjs';
import {MenuNode} from "../../../../domain-layout/src";

@Injectable({
  providedIn: 'root',
})
export class MenuApiService {
  constructor(private http: HttpClient, private apiService: APIService) {}

  loadDummyMenus(): Observable<MenuNode[]> {
    return this.http
      .get<{ data: MenuNode[] }>('assets/demo/data/menus.json')
      .pipe(
        map(response => {
          return response.data as MenuNode[];
        })
      );
  }
}
