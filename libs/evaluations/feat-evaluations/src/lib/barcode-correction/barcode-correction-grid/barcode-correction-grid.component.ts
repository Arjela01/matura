import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { GRID_ACTIONS, GridEvent } from '@msh/shared/util-shared';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule, NgForm } from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { ArchiveFolderApiService } from '@msh/evaluations/data-access-evaluations';
import {ArchiveExam, ArchiveFolder} from '@msh/evaluations/domain-evaluations';
import {HttpClient} from "@angular/common/http";
import {AcademicYearApiService} from "@msh/configurations/data-access-configurations";

@Component({
  selector: 'msh-barcode-correction-grid',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
    RippleModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './barcode-correction-grid.component.html',
  styleUrls: ['./barcode-correction-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarcodeCorrectionGridComponent {
  @Input() archiveFolders: ArchiveFolder[] = [];

  @Input() totalRecords = 0;
  @Input() loading = false;

  //Keep it local state because of Table Header checkbox not syncing
  selectedArchiveFolders: ArchiveFolder[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<ArchiveFolder | ArchiveFolder[]>
  >();

  @Output() formSave = new EventEmitter<ArchiveFolder>();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  @ViewChild('form', { static: true }) form!: NgForm;
  saving = false;

  @Input() set archiveFolderDetails(details: ArchiveFolder | null) {
    if (details) {
      this.archiveFolder = Object.assign({}, details);
    }
  }

  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private readonly academicYearService: AcademicYearApiService,
    private readonly archiveFolderService: ArchiveFolderApiService,
    private router: Router,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,

    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

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

  onEditClick(archiveFolder: ArchiveFolder) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: archiveFolder,
    } as GridEvent<ArchiveFolder>);
  }

  onRowSelect({ data }: { data: ArchiveFolder }) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.SELECT_ROW,
      data: data.id,
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

  persistArchiveFolder(archiveFolder: ArchiveFolder){
    this.archiveFolderService.currentArchiveFolder$.next(archiveFolder);
  }
}
