import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { UniversityDepartment } from '@msh/configurations/domain-configurations';
import { GridEvent, GRID_ACTIONS } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'msh-university-department-grid',
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
  templateUrl: './university-department-grid.component.html',
  styleUrls: ['./university-department-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UniversityDepartmentGridComponent {
  @Input() universityDepartments: UniversityDepartment[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  //Keep it local state because of Table Header checkbox not syncing
  selectedRegions: UniversityDepartment[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<UniversityDepartment | UniversityDepartment[]>
  >();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  onEditClick(university: UniversityDepartment) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: university,
    } as GridEvent<UniversityDepartment>);
  }

  onDeleteClick(university: UniversityDepartment) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: university,
    } as GridEvent<UniversityDepartment>);
  }

  onSelectAllClick() {
    if (this.selectedRegions.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<UniversityDepartment>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedRegions,
      } as GridEvent<UniversityDepartment[]>);
    }
  }

  onRowSelect({ data }: { data: UniversityDepartment }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: data,
    } as GridEvent<UniversityDepartment>);
  }

  onRowUnselect({ data }: { data: UniversityDepartment }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: data,
    } as GridEvent<UniversityDepartment>);
  }

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
