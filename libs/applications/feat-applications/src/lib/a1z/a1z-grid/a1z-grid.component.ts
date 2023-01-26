import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { GRID_ACTIONS, GridEvent } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { A1Z } from '../../../../../domain-applications/a1z/a1z.model';

@Component({
  selector: 'msh-a1z-grid',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
    RippleModule,
  ],
  templateUrl: './a1z-grid.component.html',
  styleUrls: ['./a1z-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class A1zGridComponent {
  @Input() a1z: A1Z[] = [];
  @Input() totalRecords = 0;
  selectedA1Z: A1Z[] = [];

  @Output() gridEvent = new EventEmitter<GridEvent<A1Z | A1Z[]>>();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  onEditClick(A1Z: A1Z) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: A1Z,
    } as GridEvent<A1Z>);
  }

  onDeleteClick(A1Z: A1Z) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: A1Z,
    } as GridEvent<A1Z>);
  }

  onSelectAllClick() {
    if (this.selectedA1Z.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<A1Z>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedA1Z,
      } as GridEvent<A1Z[]>);
    }
  }

  onRowSelect({ data }: { data: A1Z }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: data,
    } as GridEvent<A1Z>);
  }

  onRowUnselect({ data }: { data: A1Z }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: data,
    } as GridEvent<A1Z>);
  }

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
