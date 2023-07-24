import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Gender } from '@msh/shared/domain-models';
import {
  GridEvent,
  GRID_ACTIONS,
  ColumnFilterDirective,
} from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'msh-gender-grid',
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
  templateUrl: './gender-grid.component.html',
  styleUrls: ['./gender-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenderGridComponent {
  @Input() genders: Gender[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  //Keep it local state because of Table Header checkbox not syncing
  selectedGenders: Gender[] = [];

  @Output() gridEvent = new EventEmitter<GridEvent<Gender | Gender[]>>();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  onEditClick(gender: Gender) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: gender,
    } as GridEvent<Gender>);
  }

  onDeleteClick(gender: Gender) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: gender,
    } as GridEvent<Gender>);
  }

  onSelectAllClick() {
    if (this.selectedGenders.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<Gender>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedGenders,
      } as GridEvent<Gender[]>);
    }
  }

  onRowSelect({ data }: { data: Gender }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: data,
    } as GridEvent<Gender>);
  }

  onRowUnselect({ data }: { data: Gender }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: data,
    } as GridEvent<Gender>);
  }

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
