import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministrationOffice } from '@msh/shared/domain-models';
import {
  GridEvent,
  GRID_ACTIONS,
  ColumnFilterDirective,
} from '@msh/shared/util-shared';
import {
  TableLazyLoadEvent,
  TableRowSelectEvent,
  TableRowUnSelectEvent,
} from 'primeng/table';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';
import {AppBoolPipe} from "@msh/shared/ui-shared";

@Component({
  selector: 'msh-administration-office-grid',
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
    AppBoolPipe,
  ],
  templateUrl: './administration-office-grid.component.html',
  styleUrls: ['./administration-office-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdministrationOfficeGridComponent {
  @Input() administrationOffices: AdministrationOffice[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  //Keep it local state because of Table Header checkbox not syncing
  selectedAdministrationOffices: AdministrationOffice[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<AdministrationOffice | AdministrationOffice[]>
  >();

  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();

  onEditClick(administrationOffice: AdministrationOffice) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: administrationOffice,
    } as GridEvent<AdministrationOffice>);
  }

  onDeleteClick(administrationOffice: AdministrationOffice) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: administrationOffice,
    } as GridEvent<AdministrationOffice>);
  }

  onSelectAllClick() {
    if (this.selectedAdministrationOffices.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<AdministrationOffice>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedAdministrationOffices,
      } as GridEvent<AdministrationOffice[]>);
    }
  }

  onRowSelect($event: TableRowSelectEvent) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: $event.data,
    } as GridEvent<AdministrationOffice>);
  }

  onRowUnselect($event: TableRowUnSelectEvent) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: $event.data,
    } as GridEvent<AdministrationOffice>);
  }

  loadRows($event: TableLazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
