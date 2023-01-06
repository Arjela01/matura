import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ProfileGroup} from '@msh/configurations/domain-configurations';
import { GridEvent, GRID_ACTIONS } from '@msh/shared/util-shared';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'msh-profile-group-grid',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,

  ],
  templateUrl: './profile-group-grid.component.html',
  styleUrls: ['./profile-group-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileGroupGridComponent {
  @Input() profileGroup: ProfileGroup[] = [];

  //Keep it local state because of Table Header checkbox not syncing
  selectedProfileGroup: ProfileGroup[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<ProfileGroup | ProfileGroup[]>
    >();

  onEditClick(profileGroup: ProfileGroup) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: profileGroup,
    } as GridEvent<ProfileGroup>);
  }

  onDeleteClick(profileGroup: ProfileGroup) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: profileGroup,
    } as GridEvent<ProfileGroup>);
  }

  onSelectAllClick() {
    if (this.selectedProfileGroup.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<ProfileGroup>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedProfileGroup,
      } as GridEvent<ProfileGroup[]>);
    }
  }

  onRowSelect({ data }: { data: ProfileGroup }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: data,
    } as GridEvent<ProfileGroup>);
  }

  onRowUnselect({ data }: { data: ProfileGroup }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: data,
    } as GridEvent<ProfileGroup>);
  }
}
