import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { University } from '@msh/shared/domain-models';
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
  templateUrl: './university-grid.component.html',
  styleUrls: ['./university-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UniversityGridComponent {
  @Input() universities: University[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  //Keep it local state because of Table Header checkbox not syncing
  selectedRegions: University[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<University | University[]>
    >();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  onEditClick(region: University) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: region,
    } as GridEvent<University>);
  }

  onDeleteClick(region: University) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: region,
    } as GridEvent<University>);
  }

  onSelectAllClick() {
    if (this.selectedRegions.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<University>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedRegions,
      } as GridEvent<University[]>);
    }
  }

  onRowSelect({ data }: { data: University }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: data,
    } as GridEvent<University>);
  }

  onRowUnselect({ data }: { data: University }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: data,
    } as GridEvent<University>);
  }

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
