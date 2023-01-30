import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output, ViewChild,
} from '@angular/core';
import {
  ArchiveFolder,
} from '@msh/configurations/domain-configurations';
import { GridEvent, GRID_ACTIONS } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import {  RouterLink } from '@angular/router';
import {FormsModule, NgForm} from '@angular/forms';

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
    FormsModule,
  ],
  templateUrl: './archive-folder-grid.component.html',
  styleUrls: ['./archive-folder-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchiveFolderGridComponent {
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

  hideBarCode = false;
  _opened = true;
  status = false;
  id: any;
  clickOpen(): void {
    this._opened = !this._opened;
    this.hideBarCode = !this._opened;
    this.status = !this._opened;
  }

  onDeleteClick(archiveFolder: ArchiveFolder) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: archiveFolder,
    } as GridEvent<ArchiveFolder>);
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

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
