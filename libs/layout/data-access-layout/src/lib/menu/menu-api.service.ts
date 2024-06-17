import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MenuNode } from '@msh/layout/domain-layout';
import { APIService } from '@msh/shared/util-shared';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuApiService {
  constructor(
    private http: HttpClient,
    private apiService: APIService
  ) {}

  loadMenus(): Observable<MenuNode[]> {
    return this.apiService.get<{ data: MenuNode[] }>(`/Menu`).pipe(
      map(response => {
        return this.convertToTree(response.data as MenuNode[]);
      })
    );
  }

  private convertToTree(menus: MenuNode[]): MenuNode[] {
    const nest = (menus: MenuNode[], id: number | null = null): MenuNode[] =>
      menus
        .filter(item => item.parentId === id)
        .map(menu => ({ ...menu, children: nest(menus, menu.id) }))
        .sort((a, b) => (b.text < a.text ? 1 : -1))
        .sort((a, b) => {
          if (a.displayOrder === b.displayOrder) {
            return 1;
          } else if (a.displayOrder > b.displayOrder) {
            return 1;
          } else {
            return -1;
          }
        })
        .filter(menu => menu.isVisible);
    return nest(menus, 0);
  }
}
