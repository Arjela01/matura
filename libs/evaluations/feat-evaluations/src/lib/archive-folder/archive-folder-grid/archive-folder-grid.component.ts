import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  GridEvent,
  GRID_ACTIONS,
  ColumnFilterDirective,
} from '@msh/shared/util-shared';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import {
  TableLazyLoadEvent,
  TableModule,
  TableRowSelectEvent,
  TableRowUnSelectEvent,
} from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ArchiveFolderApiService } from '@msh/evaluations/data-access-evaluations';
import { ArchiveFolder, statuses, Student } from '@msh/shared/domain-models';
import { DialogModule } from 'primeng/dialog';
import { ArchiveFolderHistoryGridComponent } from '../archive-folder-history/archive-folder-history-grid.component';
import { DropdownModule } from 'primeng/dropdown';

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
    ToggleButtonModule,
    RadioButtonModule,
    ColumnFilterDirective,
    DialogModule,
    ArchiveFolderHistoryGridComponent,
    DropdownModule,
  ],
  templateUrl: './archive-folder-grid.component.html',
  styleUrls: ['./archive-folder-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchiveFolderGridComponent {
  @Input() archiveFolders: ArchiveFolder[] = [];
  statuses = statuses;

  @Input() totalRecords = 0;
  @Input() loading = false;

  //Keep it local state because of Table Header checkbox not syncing
  selectedArchiveFolders: ArchiveFolder[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<ArchiveFolder | ArchiveFolder[]>
  >();

  @Output() formSave = new EventEmitter<ArchiveFolder>();

  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();

  @ViewChild('form', { static: true }) form!: NgForm;

  @Input() set archiveFolderDetails(details: ArchiveFolder | null) {
    if (details) {
      this.archiveFolder = Object.assign({}, details);
    }
  }

  constructor(
    private readonly archiveFolderService: ArchiveFolderApiService,

    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }
  @Input() folderNr: any;
  @Input() headerText = '';
  @Input() displayHistoryForm = true;
  @Input() selectedRecord: any;

  archiveFolder: ArchiveFolder = {
    examTypeName: '',
    examTypeId: 0,
    examSubjectId: '',
    examSubjectName: '',
    id: '',
    isClosed: false,
    lastUserId: undefined,
    totalArchiveExams: 0,
    nr: 0,
  };

  submitted = false;
  id: any;

  changeStatus(archive: ArchiveFolder): void {
    this.gridEvent.emit({
      action: GRID_ACTIONS.CUSTOM_ACTION1,
      data: archive,
    } as GridEvent<ArchiveFolder>);
  }

  onDeleteClick(archiveFolder: ArchiveFolder) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: archiveFolder,
    } as GridEvent<ArchiveFolder>);
  }
  onEditClick(archiveFolder: ArchiveFolder) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: archiveFolder,
    } as GridEvent<ArchiveFolder>);
  }
  onHistoryClick(archiveFolder: ArchiveFolder) {
    this.displayHistoryForm = true;
    this.gridEvent.emit({
      action: GRID_ACTIONS.HISTORY,
      data: archiveFolder,
    } as GridEvent<Student>);
  }

  onRowSelect($event: TableRowSelectEvent) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: $event.data,
    } as GridEvent<ArchiveFolder>);
  }

  onRowUnselect($event: TableRowUnSelectEvent) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.UNSELECT_ROW,
      data: $event.data,
    } as GridEvent<ArchiveFolder>);
  }

  loadRows($event: TableLazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }

  addBarcodes(archiveFolder: ArchiveFolder) {
    this.archiveFolderService.currentArchiveFolder$.next(archiveFolder);
  }
}
