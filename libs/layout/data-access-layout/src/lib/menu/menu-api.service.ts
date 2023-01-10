import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIService } from '@msh/shared/util-shared';
import { map, Observable } from 'rxjs';
import { MenuNode } from '@msh/layout/domain-layout';

@Injectable({
  providedIn: 'root',
})
export class MenuApiService {
  constructor(private http: HttpClient, private apiService: APIService) {}

  loadMenus(): Observable<MenuNode[]> {
    return this.apiService.get<{ data: MenuNode[] }>(`/Menu`).pipe(
      map(response => {
        return this.convertToTree(response.data as MenuNode[]);
      })
    );
  }

  // TODO : Test out isvisible false
  private convertToTree(menus: MenuNode[]): MenuNode[] {
    console.log(menus);
    const nest = (menus: MenuNode[], id: number | null = null): MenuNode[] =>
      menus
        .filter(item => item.parentId === id)
        .map(menu => ({ ...menu, children: nest(menus, menu.id) }))
        .sort((a, b) => (a.displayOrder > b.displayOrder ? 1 : -1));
    // .filter(menu => menu.isVisible);

    console.log(nest(menus));
    return nest(menus);
  }
}
