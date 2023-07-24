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
import { LazyLoadEvent } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';

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

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

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

  onRowSelect({ data }: { data: AdministrationOffice }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: data,
    } as GridEvent<AdministrationOffice>);
  }

  onRowUnselect({ data }: { data: AdministrationOffice }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: data,
    } as GridEvent<AdministrationOffice>);
  }

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
