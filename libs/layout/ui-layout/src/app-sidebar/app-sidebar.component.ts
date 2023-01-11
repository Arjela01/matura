import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { LayoutService } from '@msh/layout/util-layout';
import { AppMenuitemComponent } from './../app-menuitem/app-menuitem.component';

import { MenuItem } from 'primeng/api';

@Component({
  selector: 'msh-app-sidebar',
  standalone: true,
  imports: [CommonModule, AppMenuitemComponent],
  templateUrl: './app-sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppSidebarComponent implements OnInit {
  //TODO: This will be dynamic
  model: MenuItem[] = [];

  constructor(public layoutService: LayoutService) {}

  ngOnInit() {
    this.model = [
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
        items: [
          {
            label: 'Submenu 1',
            icon: 'pi pi-fw pi-bookmark',
            items: [
              {
                label: 'Submenu 1.1',
                icon: 'pi pi-fw pi-bookmark',
                items: [
                  {
                    label: 'Submenu 1.1.1',
                    icon: 'pi pi-fw pi-bookmark',
                  },
                  {
                    label: 'Submenu 1.1.2',
                    icon: 'pi pi-fw pi-bookmark',
                  },
                  {
                    label: 'Submenu 1.1.3',
                    icon: 'pi pi-fw pi-bookmark',
                  },
                ],
              },
              {
                label: 'Submenu 1.2',
                icon: 'pi pi-fw pi-bookmark',
                items: [
                  {
                    label: 'Submenu 1.2.1',
                    icon: 'pi pi-fw pi-bookmark',
                  },
                ],
              },
            ],
          },
          {
            label: 'Submenu 2',
            icon: 'pi pi-fw pi-bookmark',
            items: [
              {
                label: 'Submenu 2.1',
                icon: 'pi pi-fw pi-bookmark',
                items: [
                  {
                    label: 'Submenu 2.1.1',
                    icon: 'pi pi-fw pi-bookmark',
                  },
                  {
                    label: 'Submenu 2.1.2',
                    icon: 'pi pi-fw pi-bookmark',
                  },
                ],
              },
              {
                label: 'Submenu 2.2',
                icon: 'pi pi-fw pi-bookmark',
                items: [
                  {
                    label: 'Submenu 2.2.1',
                    icon: 'pi pi-fw pi-bookmark',
                  },
                ],
              },
            ],
          },
        ],
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
  }
}
