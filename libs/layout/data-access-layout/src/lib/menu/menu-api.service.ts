import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIService } from '@msh/shared/util-shared';
import { map, Observable } from 'rxjs';
import { MenuNode } from "../../../../domain-layout/src";

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
          return this.convertToTree(response.data);
        })
      );
  }

  // TODO : MOVE THESE FUNCTIONS


  private convertToTree(menus: MenuNode[]): MenuNode[] {
    const nest = (menus: MenuNode[], id: number | null = null): MenuNode[] =>
      menus
        .filter(item => item.Parent === id)
        .map(menu => ({ ...menu, Children: nest(menus, menu.ID) }))
        .sort((a , b) => a.DisplayOrder > b.DisplayOrder ? 1 : -1);

    return nest(menus);
  }


}

