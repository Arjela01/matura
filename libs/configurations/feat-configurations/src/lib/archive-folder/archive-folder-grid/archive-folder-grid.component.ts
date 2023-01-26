import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {ArchiveFolder, Student} from '@msh/configurations/domain-configurations';
import { GridEvent, GRID_ACTIONS } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'msh-archive-folder-grid',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
    RippleModule,
    RouterLink,
  ],
  templateUrl: './archive-folder-grid.component.html',
  styleUrls: ['./archive-folder-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchiveFolderGridComponent {
  @Input() archiveFolders: ArchiveFolder[]  | Student[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  selectedArchiveFolders: ArchiveFolder[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<ArchiveFolder | ArchiveFolder[]>
  >();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

constructor(
  private router: Router,

) {
}
  onEditClick(archiveFolder: ArchiveFolder) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: archiveFolder,
    } as GridEvent<ArchiveFolder>);
  }

  onDeleteClick(archiveFolder: ArchiveFolder) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: archiveFolder,
    } as GridEvent<ArchiveFolder>);
  }

  onSelectAllClick() {
    if (this.selectedArchiveFolders.length === 0) {
      this.gridEvent.emit({
        action: GRID_ACTIONS.UNSELECT_ALL,
      } as GridEvent<ArchiveFolder>);
    } else {
      this.gridEvent.emit({
        action: GRID_ACTIONS.SELECT_MANY,
        data: this.selectedArchiveFolders,
      } as GridEvent<ArchiveFolder[]>);
    }
  }

  onRowSelect({ data }: { data: ArchiveFolder }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: data,
    } as GridEvent<ArchiveFolder>);
  }

  onRowUnselect({ data }: { data: ArchiveFolder }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: data,
    } as GridEvent<ArchiveFolder>);
  }

  // viewArchive(viewArchive: ArchiveFolder) {
  //   this.router.navigate(['/configurations/archive-view']).then();
  // }
  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
