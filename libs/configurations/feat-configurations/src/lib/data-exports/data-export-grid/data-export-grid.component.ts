import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { DataExport } from '@msh/shared/domain-models';
import {GridEvent, GRID_ACTIONS, ColumnFilterDirective} from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'msh-data-export-grid',
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
  templateUrl: './data-export-grid.component.html',
  styleUrls: ['./data-export-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataExportGridComponent {
  @Input() dataExports: DataExport[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  //Keep it local state because of Table Header checkbox not syncing
  selectedDataExports: DataExport[] = [];

  @Output() gridEvent = new EventEmitter<GridEvent<DataExport | DataExport[]>>();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  onEditClick(dataExport: DataExport) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: dataExport,
    } as GridEvent<DataExport>);
  }

  onDeleteClick(dataExport: DataExport) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: dataExport,
    } as GridEvent<DataExport>);
  }

  onSelectAllClick() {
    if (this.selectedDataExports.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<DataExport>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedDataExports,
      } as GridEvent<DataExport[]>);
    }
  }

  onRowSelect({ data }: { data: DataExport }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: data,
    } as GridEvent<DataExport>);
  }

  onRowUnselect({ data }: { data: DataExport }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: data,
    } as GridEvent<DataExport>);
  }

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
