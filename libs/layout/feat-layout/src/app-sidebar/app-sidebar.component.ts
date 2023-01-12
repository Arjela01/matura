import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { LayoutService } from '@msh/layout/util-layout';
import { AppMenuitemComponent } from '../app-menuitem/app-menuitem.component';

import { MenuItem } from 'primeng/api';
import { MenuStore } from '@msh/layout/data-access-layout';
import { map, Observable } from 'rxjs';
import { MenuNode } from '@msh/layout/domain-layout';

@Component({
  selector: 'msh-app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    AppMenuitemComponent
  ],
  providers: [MenuStore],
  templateUrl: './app-sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppSidebarComponent implements OnInit {
  //TODO: This will be dynamic
  model$: Observable<MenuItem[]> = this.menuStore.menus$.pipe(
    map(menus => {
      return [
        {
          label: 'Menu',
          items: this.format(menus as MenuNode[]),
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

  private format(menus: MenuNode[]): MenuItem[] {
    const reformat = (node: MenuNode): MenuItem => {
      const output: MenuItem = {};
      output['icon'] = 'pi pi-fw pi-bookmark';
      output['label'] = node.text;
      if (node.children.length == 0) output['routerLink'] = node.url;
      if (node.children.length != 0)
        output['items'] = node.children?.map(x => reformat(x));
      return output;
    };
    return menus.map(x => reformat(x));
  }
}
