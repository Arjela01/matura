import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { Gender } from '@msh/configurations/domain-configurations';
import { GridEvent, GRID_ACTIONS } from '@msh/shared/util-shared';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'msh-gender-grid',
  standalone: true,
  imports: [CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,],
  templateUrl: './gender-grid.component.html',
  styleUrls: ['./gender-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenderGridComponent {
  @Input() genders: Gender[] = [];

  //Keep it local state because of Table Header checkbox not syncing
  selectedGenderIds: Gender[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<Gender | Gender[]>
  >();

  onEditClick(gender: Gender) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: gender,
    } as GridEvent<Gender>);
  }
  ngAfterViewChecked() {
    console.log(this.genders)
  }

  onDeleteClick(gender: Gender) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: gender,
    } as GridEvent<Gender>);
  }

  onSelectAllClick() {
    if (this.selectedGenderIds.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<Gender>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedGenderIds,
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
}
