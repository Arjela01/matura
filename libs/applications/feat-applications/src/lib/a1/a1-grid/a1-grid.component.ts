import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { A1 } from '@msh/applications/domain-application';
import { GridEvent, GRID_ACTIONS } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
@Component({
  selector: 'a1-grid',
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
  ],
  templateUrl: './a1-grid.component.html',
  styleUrls: ['./a1-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class A1GridComponent {
  @Input() a1: A1[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  //Keep it local state because of Table Header checkbox not syncing
  selectedA1: A1[] = [];

  @Output() gridEvent = new EventEmitter<GridEvent<A1 | A1[]>>();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  onEditClick(a1: A1) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: a1,
    } as GridEvent<A1>);
  }

  onDeleteClick(a1: A1) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: a1,
    } as GridEvent<A1>);
  }

  onSelectAllClick() {
    if (this.selectedA1.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<A1>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedA1,
      } as GridEvent<A1[]>);
    }
  }

  onRowSelect({ data }: { data: A1 }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: data,
    } as GridEvent<A1>);
  }

  onRowUnselect({ data }: { data: A1 }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: data,
    } as GridEvent<A1>);
  }

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
