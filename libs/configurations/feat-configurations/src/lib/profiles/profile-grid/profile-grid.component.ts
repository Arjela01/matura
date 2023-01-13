import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { GridEvent, GRID_ACTIONS } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { Profile } from '@msh/configurations/domain-configurations';

@Component({
  selector: 'msh-profile-grid',
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
  templateUrl: './profile-grid.component.html',
  styleUrls: ['./profile-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileGridComponent {
  @Input() profiles: Profile[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  //Keep it local state because of Table Header checkbox not syncing
  selectedProfiles: Profile[] = [];

  @Output() gridEvent = new EventEmitter<GridEvent<Profile | Profile[]>>();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  onEditClick(profile: Profile) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: profile,
    } as GridEvent<Profile>);
  }

  onDeleteClick(profile: Profile) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: profile,
    } as GridEvent<Profile>);
  }

  onSelectAllClick() {
    if (this.selectedProfiles.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<Profile>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedProfiles,
      } as GridEvent<Profile[]>);
    }
  }

  onRowSelect({ data }: { data: Profile }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: data,
    } as GridEvent<Profile>);
  }

  onRowUnselect({ data }: { data: Profile }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: data,
    } as GridEvent<Profile>);
  }

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
