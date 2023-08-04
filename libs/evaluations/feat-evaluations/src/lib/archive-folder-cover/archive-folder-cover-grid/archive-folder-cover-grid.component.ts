import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

import { UntilDestroy } from '@ngneat/until-destroy';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import {
  GridEvent,
  GRID_ACTIONS,
  ColumnFilterDirective,
} from '@msh/shared/util-shared';
import { TableModule } from 'primeng/table';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { StepsModule } from 'primeng/steps';
import { ArchiveFolder } from '@msh/shared/domain-models';

@UntilDestroy()
@Component({
  selector: 'msh-archive-folder-cover-grid',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ToastModule,
    StepsModule,
    ColumnFilterDirective,
  ],
  templateUrl: './archive-folder-cover-grid.component.html',
  styleUrls: ['./archive-folder-cover-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ArchiveFolderCoverGridComponent {
  @Input() archiveFolders: ArchiveFolder[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  //Keep it local state because of Table Header checkbox not syncing
  selectedArchiveFolders: ArchiveFolder[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<ArchiveFolder | ArchiveFolder[]>
  >();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  @ViewChild('form', { static: true }) form!: NgForm;

  archiveFolder: ArchiveFolder = {
    nr: 0,
    isClosed: false,
    lastUserId: undefined,
    examTypeId: 0,
    id: 0,
  };
  saving = false;

  onSubmit(): void {
    // DODO
  }

  onEditClick(archiveFolder: ArchiveFolder) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: archiveFolder,
    } as GridEvent<ArchiveFolder>);
  }
  onActivate(archiveFolder: ArchiveFolder) {
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

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
