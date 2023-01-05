import { CommonModule } from '@angular/common';
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import { LayoutService } from '@msh/layout/util-layout';
import { AppMenuitemComponent } from '../app-menuitem/app-menuitem.component';

import { MenuItem } from 'primeng/api';
import { MenuStore } from "../../../data-access-layout/src";
import {map, Observable} from "rxjs";
import {MenuNode} from "../../../domain-layout/src";

@Component({
  selector: 'msh-app-sidebar',
  standalone: true,
  imports: [CommonModule, AppMenuitemComponent],
  providers: [MenuStore],
  templateUrl: './app-sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppSidebarComponent implements OnInit {
  //TODO: This will be dynamic
  model$: Observable<MenuItem[]> = this.menuStore.menus$.pipe(
    map(menus => {
      return this.format(menus)
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
      output["icon"] = 'pi pi-fw pi-bookmark';
      output["label"] = node.Text;
      if (node.Children.length == 0) output["routerLink"] = node.Url;
      if (node.Children.length != 0) output["items"] = node.Children?.map((x) => reformat(x));
      return output;

    };
    return menus.map((x) => reformat(x));

  }
}
