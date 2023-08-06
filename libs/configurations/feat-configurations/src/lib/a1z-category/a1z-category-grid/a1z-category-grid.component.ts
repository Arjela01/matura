import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { A1ZCategory } from '@msh/shared/domain-models';
import {
  GridEvent,
  GRID_ACTIONS,
  ColumnFilterDirective,
} from '@msh/shared/util-shared';
import {TableLazyLoadEvent, TableRowSelectEvent, TableRowUnSelectEvent} from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'msh-a1z-categories-grid',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    RadioButtonModule,
    InputTextareaModule,
    ButtonModule,
    TooltipModule,
    CheckboxModule,
    RippleModule,
    TableModule,
    ColumnFilterDirective,
  ],
  templateUrl: './a1z-category-grid.component.html',
  styleUrls: ['./a1z-category-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class A1zCategoryGridComponent {
  @Input() a1zCategories: A1ZCategory[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  //Keep it local state because of Table Header checkbox not syncing
  selectedA1zCategories: A1ZCategory[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<A1ZCategory | A1ZCategory[]>
  >();

  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();

  onEditClick(a1zCategory: A1ZCategory) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: a1zCategory,
    } as GridEvent<A1ZCategory>);
  }

  onDeleteClick(a1zCategory: A1ZCategory) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: a1zCategory,
    } as GridEvent<A1ZCategory>);
  }

  onSelectAllClick() {
    if (this.selectedA1zCategories.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<A1ZCategory>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedA1zCategories,
      } as GridEvent<A1ZCategory[]>);
    }
  }

  onRowSelect($event: TableRowSelectEvent) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: $event.data,
    } as GridEvent<A1ZCategory>);
  }

  onRowUnselect($event: TableRowUnSelectEvent) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: $event.data,
    } as GridEvent<A1ZCategory>);
  }

  loadRows($event: TableLazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
