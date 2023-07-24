import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  ArchiveExamApiService,
  ArchiveFolderApiService,
} from '@msh/evaluations/data-access-evaluations';
import {
  ArchiveExam,
  ArchiveFolder,
} from '@msh/evaluations/domain-evaluations';
import { BehaviorSubject } from 'rxjs';
import { GridEvent } from '@msh/shared/util-shared';
import { Location } from '@angular/common';

@UntilDestroy()
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
    RouterLink,
  ],
  templateUrl: './archive-folder-view.component.html',
  styleUrls: ['./archive-folder-view.component.scss'],
})
export class ArchiveFolderViewComponent implements OnInit {
  @Input() loading = false;

  @Output() gridEvent = new EventEmitter<
    GridEvent<ArchiveExam | ArchiveFolder[]>
  >();
  @Input() barCodes: ArchiveExam[] = [];

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  @Input() set barCodeDetails(details: ArchiveExam | null) {
    if (details) {
      this.archiveExam = Object.assign({}, details);
    }
  }

  @Output() formSave = new EventEmitter<ArchiveExam[] | ArchiveFolder[]>();

  @ViewChild('form', { static: true }) form!: NgForm;
  private archiveExams$$ = new BehaviorSubject<ArchiveExam[]>([]);

  filters: LazyLoadEvent | null = null;

  submitted = false;

  id: any;
  archiveFolder: ArchiveFolder = {} as ArchiveFolder;
  archiveExam: ArchiveExam = {
    archiveFolderNr: 0,
    id: undefined,
    index: 0,
    archiveFolderId: 0,
    barcode: '',
  };
  archiveExams: ArchiveExam[] = [];
  totalRecords = 0;
  displayModal = false;

  constructor(
    private cd: ChangeDetectorRef,
    private archiveExamApiService: ArchiveExamApiService,
    private archiveFolderService: ArchiveFolderApiService,
    private router: Router,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id = parseInt(id);
    }
    this.archiveFolder = {};
  }

  ngOnInit() {
    this.archiveFolderService
      .getById(this.id)
      .subscribe(folder => (this.archiveFolder = { ...folder.data }));
    this.changeFolderStatus();
  }
  goBack(): void {
    this.location.back();
  }

  onSubmit(): void {
    const data = { ...this.archiveExam };
    this.archiveExamApiService.save(data).subscribe({
      next: () => {
        this.submitted = false;
      },
    });
  }

  changeFolderStatus() {
    this.archiveFolderService
      .changeFolderStatus(this.id)
      .pipe(untilDestroyed(this));
    this.cd.detectChanges();
  }

  loadRows($event: LazyLoadEvent) {
    this.archiveExamApiService
      .loadArchiveExams($event, this.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.archiveExams = response.data;
        this.archiveExams$$.next(response.data);
        this.totalRecords = response.total;

        this.cd.detectChanges();
        if (response.total === 50) {
          const allRecordsLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 50,
            ...this.filters,
          };
          this.archiveExamApiService
            .loadArchiveExams(allRecordsLoadEvent, this.id)
            .pipe(untilDestroyed(this))
            .subscribe(responseWithAllRecords => {
              this.archiveExams = responseWithAllRecords.data;
              this.archiveExams$$.next(responseWithAllRecords.data);
              this.totalRecords = responseWithAllRecords.total;
              this.cd.markForCheck();
            });
        }
      });
  }
}
