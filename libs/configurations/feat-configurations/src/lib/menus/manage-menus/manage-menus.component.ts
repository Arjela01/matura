import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, TreeNode } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';

import { DataNode, Menu } from '@msh/shared/domain-models';

import {
  GlobalToastService,
  GridEvent,
  GRID_ACTIONS,
} from '@msh/shared/util-shared';

import { BehaviorSubject } from 'rxjs';
import {
  MenuApiService,
  RolesApiService,
} from '@msh/configurations/data-access-configurations';
import { MenuTreeComponent } from '../menu-tree/menu-tree.component';
import { MenuFormComponent } from '../menu-form/menu-form.component';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { RippleModule } from 'primeng/ripple';
import { TableLazyLoadEvent } from 'primeng/table';
import { TreeModule } from 'primeng/tree';
import { TreeJsonConversionPipe } from './tree-json-conversion.pipe';
import { TooltipModule } from 'primeng/tooltip';
import { HighSchoolGridComponent } from '../../high-schools/high-school-grid/high-school-grid.component';

@UntilDestroy()
@Component({
  selector: 'msh-manage-menus',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    MenuTreeComponent,
    MenuFormComponent,
    ToolbarModule,
    RippleModule,
    TreeModule,
    TreeJsonConversionPipe,
    TooltipModule,
    HighSchoolGridComponent,
  ],
  templateUrl: './manage-menus.component.html',
  styleUrls: ['./manage-menus.component.scss'],
  providers: [ConfirmationService],
})
export class ManageMenusComponent implements OnInit {
  filters: TableLazyLoadEvent | null = null;

  totalRecords = 0;
  selectedMenu: Menu | null = null;
  selectedMenus: Menu[] = [];
  displayModal = false;
  treeData: TreeNode<DataNode>[] = [];

  parentMenus: DropdownModel<number>[] = [];
  roles: DropdownModel<number>[] = [];
  event = {
    first: 0,
    rows: 100000000,
    sortOrder: 1,
    filters: {},
    globalFilter: null,
  };

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly menuService: MenuApiService,
    private readonly rolesService: RolesApiService,
    private readonly cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getMenus(this.event);
    this.getParentMenusDropdown();
    this.getRolesDropdown();
  }

  onNewClick() {
    this.displayModal = true;
    this.selectedMenu = {} as Menu;
  }

  onGridEvent(event: GridEvent<Menu | Menu[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedMenus = [...this.selectedMenus, event.data as Menu];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedMenus = this.selectedMenus.filter(m => {
          return m.id !== (event.data as Menu).id;
        });
        break;
      case GRID_ACTIONS.SELECT_MANY:
        this.selectedMenus = [...this.selectedMenus, ...(event.data as Menu[])];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedMenus = [];
        break;
      case GRID_ACTIONS.EDIT: {
        const editedMenu: any = {
          id: (event.data as any).data.id,
          displayOrder: (event.data as any).displayOrder,
          isVisible: (event.data as any).isVisible,
          url: (event.data as any).data.url,
          text: (event.data as any).label,
          parentId: (event.data as any).parentId,
          roles: (event.data as any).data.roles,
        };

        this.getParentMenusDropdown(editedMenu.parentId);
        this.selectedMenu = editedMenu;
        this.displayModal = true;
        break;
      }
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt që doni të fshini menu-në e zgjedhur?',
          accept: () => {
            this.deleteMenu(event.data as Menu);
          },
        });
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
    this.getParentMenusDropdown();
  }

  convertTreeToMenu(treeData: TreeNode<DataNode>[]): Menu[] {
    const menuList: Menu[] = [];

    function traverse(node: any) {
      if (!node) {
        return;
      }

      if (node.data) {
        const menu: Menu = {
          id: node.data.id,
          displayOrder: node.displayOrder,
          isVisible: node.isVisible,
          url: node.url,
          text: node.text,
          parentId: node.parentId,
          roles: node.roles,
        };
        menuList.push(menu);
      }

      if (node.children) {
        for (const child of node.children) {
          traverse(child);
        }
      }
    }

    for (const rootNode of treeData) {
      traverse(rootNode);
    }

    return menuList;
  }

  onFormSave(menuNode: any) {
    const jsonData: Menu[] = this.convertTreeToMenu([menuNode]);

    if (jsonData.length > 0) {
      const menu = jsonData[0];

      if (menu.id) {
        this.updateMenu(menu);
      }

      if (!menu.id) {
        this.addMenu(menuNode);
      }
    }
  }

  getMenus($event: any) {
    this.filters = Object.assign({}, $event);

    this.menuService
      .loadMenus($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.treeData = response.data;
        this.totalRecords = response.total;
        this.cd.detectChanges();
      });
  }

  addMenu(menu: Menu) {
    this.menuService
      .save(menu)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Menuja u shtua me sukses!');
          this.displayModal = false;
          this.getMenus(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të menusë!'
          );
      });
  }

  updateMenu(menu: any) {
    this.menuService
      .update(menu)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Menuja u ndryshua me sukses!');
          this.displayModal = false;
          this.getMenus(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të menusë!'
          );
      });
  }

  deleteMenu(menu: any) {
    this.menuService
      .delete(menu.data.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Menu-ja u fshi me sukses!');
          this.getMenus(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes të menu-së!'
          );
      });
  }

  getParentMenusDropdown(current: number | null = null) {
    this.menuService
      .loadDropdownList(current)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.parentMenus = response.data;
      });
  }

  getRolesDropdown() {
    this.rolesService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.roles = response.data;
      });
  }
}
