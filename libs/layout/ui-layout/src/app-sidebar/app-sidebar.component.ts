import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { LayoutService } from '@msh/layout/util-layout';
import { AppMenuitemComponent } from './../app-menuitem/app-menuitem.component';

import { MenuItem } from 'primeng/api';
import { MenuStore } from "../../../data-access-layout/src";
import {map, Observable} from "rxjs";

@Component({
  selector: 'msh-app-sidebar',
  standalone: true,
  imports: [CommonModule, AppMenuitemComponent],
  providers: [MenuStore],
  templateUrl: './app-sidebar.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppSidebarComponent implements OnInit {
  //TODO: This will be dynamic
  model$: Observable<MenuItem[]> = this.menuStore.menus$.pipe(
    map(menus => {
      return [
        {
          label: 'Home',
          items: [
            {
              label: 'Dashboard',
              icon: 'pi pi-fw pi-home',
              routerLink: ['/'],
            },
          ],
        },
        {
          label: 'Pages',
          icon: 'pi pi-fw pi-briefcase',
          items: [
            {
              label: 'Auth',
              icon: 'pi pi-fw pi-user',
              items: [
                {
                  label: 'Login',
                  icon: 'pi pi-fw pi-sign-in',
                  routerLink: ['/login'],
                },
                {
                  label: 'Access Denied',
                  icon: 'pi pi-fw pi-lock',
                  routerLink: ['/denied'],
                },
              ],
            },
            {
              label: 'Not Found',
              icon: 'pi pi-fw pi-exclamation-circle',
              routerLink: ['/notfound'],
            },
          ],
        },
        {
          label: 'Hierarchy',
          items: menus.map(menu => {
            return {
              icon:'pi pi-fw pi-bookmark',
              routerLink: menu.Url,
              label: menu.Text,
            }
          })
        },
        {
          label: 'Configurations',
          items: [
            {
              label: 'High Schools',
              icon: 'pi pi-fw pi-bookmark',
              routerLink: ['configurations', 'high-school'],
            },
          ],
        },
      ];
    })
  );

  constructor(
    private readonly menuStore: MenuStore,
    public layoutService: LayoutService
  ) {}

  ngOnInit() {
    this.menuStore.loadMenus();
  }
}
