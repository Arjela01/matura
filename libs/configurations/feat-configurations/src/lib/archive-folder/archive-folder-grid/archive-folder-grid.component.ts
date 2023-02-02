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
import { ArchiveFolder } from '@msh/configurations/domain-configurations';
import { GridEvent, GRID_ACTIONS } from '@msh/shared/util-shared';
import { LazyLoadEvent, MessageService, PrimeNGConfig } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import {
  AcademicYearApiService,
  ArchiveFolderApiService,
  GendersApiService,
  HighSchoolApiService,
  ProfileApiService,
} from '@msh/configurations/data-access-configurations';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RadioButtonModule } from 'primeng/radiobutton';
import {HttpClient} from "@angular/common/http";

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

  @Output() formSave = new EventEmitter<ArchiveFolder>();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  @ViewChild('form', { static: true }) form!: NgForm;
  saving = false;

  @Input() set archiveFolderDetails(details: ArchiveFolder | null) {
    if (details) {
      this.archiveFolder = Object.assign({}, details);
    }
  }

  constructor(  private http: HttpClient,
    private cd: ChangeDetectorRef,
    private readonly academicYearService: AcademicYearApiService,
    private readonly archiveFolderService: ArchiveFolderApiService,
    private readonly highSchoolService: HighSchoolApiService,
    private readonly profileService: ProfileApiService,
    private readonly genderService: GendersApiService,
    private router: Router,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private primengConfig: PrimeNGConfig,

    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }


  archiveFolder: ArchiveFolder = {
    examTypeName: '',
    examTypeId: 0,
    examSubjectId: '',
    examSubjectName: '',
    id: "",
    isClosed: false,
    lastUserId: undefined,
    nr: 0,
  };

  submitted = false;
  id: any;

  changeStatus(archive: ArchiveFolder): void {
    this.gridEvent.emit({
      action: GRID_ACTIONS.CHANGE,
      data: archive,
    } as GridEvent<ArchiveFolder>);
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
}
