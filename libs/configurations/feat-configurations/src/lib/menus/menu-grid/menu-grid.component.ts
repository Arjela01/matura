import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Menu } from '@msh/shared/domain-models';
import {
  GridEvent,
  GRID_ACTIONS,
  ColumnFilterDirective,
} from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'msh-menu-grid',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
    RippleModule,
    ColumnFilterDirective,
  ],
  templateUrl: './menu-grid.component.html',
  styleUrls: ['./menu-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuGridComponent {
  @Input() menus: Menu[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  //Keep it local state because of Table Header checkbox not syncing
  selectedMenus: Menu[] = [];

  @Output() gridEvent = new EventEmitter<GridEvent<Menu | Menu[]>>();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  onEditClick(menu: Menu) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: menu,
    } as GridEvent<Menu>);
  }

  onDeleteClick(menu: Menu) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: menu,
    } as GridEvent<Menu>);
  }

  onSelectAllClick() {
    if (this.selectedMenus.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<Menu>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedMenus,
      } as GridEvent<Menu[]>);
    }
  }

  onRowSelect({ data }: { data: Menu }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: data,
    } as GridEvent<Menu>);
  }

  onRowUnselect({ data }: { data: Menu }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: data,
    } as GridEvent<Menu>);
  }

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
