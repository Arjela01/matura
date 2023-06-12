import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { A1ZTableRecord } from '@msh/applications/domain-application';
import { AuthFacade } from '@msh/auth/data-access-auth';
import {ColumnFilterDirective, GRID_ACTIONS, GridEvent} from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

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
    ColumnFilterDirective
  ],
  templateUrl: './a1z-grid.component.html',
  styleUrls: ['./a1z-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class A1zGridComponent {
  @Input() a1z: A1ZTableRecord[] = [];
  @Input() totalRecords = 0;
  constructor(private authFacade: AuthFacade) {}
  selectedA1Z: A1ZTableRecord[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<A1ZTableRecord | A1ZTableRecord[]>
  >();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  onEditClick(A1Z: A1ZTableRecord) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: A1Z,
    } as GridEvent<A1ZTableRecord>);
  }

  onDeleteClick(A1Z: A1ZTableRecord) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: A1Z,
    } as GridEvent<A1ZTableRecord>);
  }

  onSelectAllClick() {
    if (this.selectedA1Z.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<A1ZTableRecord>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedA1Z,
      } as GridEvent<A1ZTableRecord[]>);
    }
  }

  onRowSelect({ data }: { data: A1ZTableRecord }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: data,
    } as GridEvent<A1ZTableRecord>);
  }

  onRowUnselect({ data }: { data: A1ZTableRecord }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: data,
    } as GridEvent<A1ZTableRecord>);
  }

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
