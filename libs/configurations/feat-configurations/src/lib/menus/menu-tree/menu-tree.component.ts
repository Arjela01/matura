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
import { TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { TreeJsonConversionPipe } from '../manage-menus/tree-json-conversion.pipe';
import { TreeModule } from 'primeng/tree';
import { TreeDragDropService, TreeNode } from 'primeng/api';

@Component({
  selector: 'msh-menu-tree',
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
    TreeJsonConversionPipe,
    TreeModule,
  ],
  templateUrl: './menu-tree.component.html',
  styleUrls: ['./menu-tree.component.scss'],
  providers: [TreeDragDropService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuTreeComponent {
  @Input() treeData: TreeNode[] = [];
  @Output() gridEvent = new EventEmitter<GridEvent<Menu | Menu[]>>();
  @Output() getTreeData = new EventEmitter<any>();

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
}
