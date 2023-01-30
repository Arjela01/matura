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
  ArchiveFolder,
} from '@msh/configurations/domain-configurations';
import { GridEvent, GRID_ACTIONS } from '@msh/shared/util-shared';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule, NgForm } from '@angular/forms';
import {
  AcademicYearApiService,
  ArchiveFolderApiService,
  GendersApiService,
  HighSchoolApiService,
  ProfileApiService,
} from '@msh/configurations/data-access-configurations';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'msh-archive-folder-view',
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
    ToolbarModule,
  ],
  templateUrl: './archive-folder-view.component.html',
  styleUrls: ['./archive-folder-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchiveFolderViewComponent {
  @Output() formSave = new EventEmitter<ArchiveFolder>();
  @Output() formClose = new EventEmitter<undefined>();

  @Input() archiveFolders: ArchiveFolder[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  //Keep it local state because of Table Header checkbox not syncing
  selectedArchiveFolders: ArchiveFolder[] = [];

  @Output() gridEvent = new EventEmitter<GridEvent<ArchiveFolder>>();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  @ViewChild('form', { static: true }) form!: NgForm;

  showArchiveFolder = false;
  submitted = false;

  archiveFolder: ArchiveFolder = {
    examTypeName: "",
    examTypeId: 0,
    examSubjectId: "",
    examSubjectName: "",
    id: 0,
    isClosed: false,
    lastUserId: undefined,
    nr: 0,
  };


  id: string | null;

  constructor(
    private cd: ChangeDetectorRef,
    private readonly academicYearService: AcademicYearApiService,
    private readonly archiveFolderService: ArchiveFolderApiService,
    private readonly highSchoolService: HighSchoolApiService,
    private readonly profileService: ProfileApiService,
    private readonly genderService: GendersApiService,
    private router: Router,
    private messageService: MessageService,

    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  saving = false;

  ngOnInit(): void {
    this.archiveFolderService.getById(this.id).subscribe(result => {
      this.archiveFolder = { ...result.data };
      this.cd.detectChanges();
    });
  }

  onSubmit(): void {
    const data = { ...this.archiveFolder };
    this.archiveFolderService.save(data).subscribe({
      next: () => {
        this.saving = false;

        this.router.navigate(['/configurations/archive-view']).then();
      },
    });
  }

  ngOnChanges(): void {
    this.showArchiveFolder = this.archiveFolder.examTypeName != null;
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
