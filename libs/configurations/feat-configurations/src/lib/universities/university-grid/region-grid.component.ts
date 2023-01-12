import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Region } from '@msh/configurations/domain-configurations';
import { GridEvent, GRID_ACTIONS } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'msh-university-grid',
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
  templateUrl: './region-grid.component.html',
  styleUrls: ['./region-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegionGridComponent {
  @Input() regions: Region[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  //Keep it local state because of Table Header checkbox not syncing
  selectedRegions: Region[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<Region | Region[]>
    >();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  onEditClick(region: Region) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: region,
    } as GridEvent<Region>);
  }

  onDeleteClick(region: Region) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: region,
    } as GridEvent<Region>);
  }

  onSelectAllClick() {
    if (this.selectedRegions.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<Region>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedRegions,
      } as GridEvent<Region[]>);
    }
  }

  onRowSelect({ data }: { data: Region }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: data,
    } as GridEvent<Region>);
  }

  onRowUnselect({ data }: { data: Region }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: data,
    } as GridEvent<Region>);
  }

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
