import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';

import { Menu } from '@msh/configurations/domain-configurations';

import {
  GlobalToastService,
  GridEvent,
  GRID_ACTIONS,
} from '@msh/shared/util-shared';

import { BehaviorSubject } from 'rxjs';
import { MenuApiService } from '@msh/configurations/data-access-configurations';
import { MenuGridComponent } from '../menu-grid/menu-grid.component';
import { MenuFormComponent } from '../menu-form/menu-form.component';
import { DropdownModel } from '@msh/shared/data-access-shared';
import {RippleModule} from "primeng/ripple";

@UntilDestroy()
@Component({
  selector: 'msh-manage-menus',
  standalone: true,
    imports: [
        ButtonModule,
        CommonModule,
        DialogModule,
        ConfirmDialogModule,
        MenuGridComponent,
        MenuFormComponent,
        ToolbarModule,
        RippleModule,
    ],
  templateUrl: './manage-menus.component.html',
  styleUrls: ['./manage-menus.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageMenusComponent implements OnInit {
  private menus$$ = new BehaviorSubject<Menu[]>([]);
  menus$ = this.menus$$.asObservable();
  filters: LazyLoadEvent | null = null;

  totalRecords = 0;
  selectedMenu: Menu | null = null;
  selectedMenus: Menu[] = [];
  displayModal = false;

  parentMenus: DropdownModel<number>[] = [];

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly menuService: MenuApiService
  ) {}

  ngOnInit(): void {
    this.getParentMenusDropdown();
  }

  onNewClick() {
    this.displayModal = true;
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Jeni i sigurt që doni të fshini shkollat e zgjedhura?',
      accept: () => {
        this.toastService.showWarning('High Schools deleted!');
      },
    });
  }

  onGridEvent(event: GridEvent<Menu | Menu[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedMenus = [...this.selectedMenus, event.data as Menu];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedMenus = this.selectedMenus.filter(hs => {
          hs.id !== (event.data as Menu).id;
        });
        break;
      case GRID_ACTIONS.SELECT_MANY:
        this.selectedMenus = [...this.selectedMenus, ...(event.data as Menu[])];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedMenus = [];
        break;
      case GRID_ACTIONS.EDIT:
        this.getParentMenusDropdown((event.data as Menu).id);
        this.selectedMenu = Object.assign({}, event.data as Menu);
        this.displayModal = true;
        break;
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

  onFormSave(menu: Menu) {
    if (menu.id) {
      this.updateMenu(menu);
    }
    if (!menu.id) {
      this.addMenu(menu);
    }
  }

  getMenus($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.menuService
      .loadMenus($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.menus$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  addMenu(menu: Menu) {
    this.menuService
      .save(menu)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Shkolla e mesme u shtua me sukses!');
          this.displayModal = false;
          this.getMenus(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi nje problem gjatë ndryshimit së shkollës së mesme!'
          );
      });
  }

  updateMenu(menu: Menu) {
    this.menuService
      .update(menu)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            'Shkolla e mesme u ndryshua me sukses!'
          );
          this.displayModal = false;
          this.getMenus(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi nje problem gjatë ndryshimit së shkollës së mesme!'
          );
      });
  }

  deleteMenu(menu: Menu) {
    this.menuService
      .delete(menu.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Menu-ja u fshi me sukses!');
          this.getMenus(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi nje problem gjatë fshirjes së menu-së!'
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
}
