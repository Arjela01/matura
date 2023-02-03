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
import { BehaviorSubject, take } from 'rxjs';
import { GridEvent } from '@msh/shared/util-shared';

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
      this.barCode = Object.assign({}, details);
    }
  }

  @Output() formSave = new EventEmitter<ArchiveExam[] | ArchiveFolder[]>();

  @ViewChild('form', { static: true }) form!: NgForm;
  private barCodes$$ = new BehaviorSubject<ArchiveExam[]>([]);
  private archiveFolders$$ = new BehaviorSubject<ArchiveFolder[]>([]);

  filters: LazyLoadEvent | null = null;
  barCodes$ = this.barCodes$$.asObservable();

  submitted = false;

  id: any;
  archiveFolder: ArchiveFolder;
  barCode: ArchiveExam = {
    index: 0,
    archiveFolderId: 0,
    barcode: '',
  };
  barcodes: ArchiveExam[] = [];
  archiveFolders: ArchiveFolder[] = [];
  totalRecords = 0;
  displayModal = false;

  constructor(
    private cd: ChangeDetectorRef,
    private barcodeApiService: ArchiveExamApiService,
    private archiveFolderService: ArchiveFolderApiService,
    private router: Router,
    private messageService: MessageService,
    private route: ActivatedRoute,
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id = parseInt(id);
    }
    this.archiveFolder = {};

  }

  ngOnInit() {
    this.archiveFolderService.currentArchiveFolder$
      .pipe(take(1))
      .subscribe(response => {
        if (response != null) {
          this.archiveFolder = { ...response };
          console.log(this.archiveFolder);
          sessionStorage.setItem(
            'archiveFolder',
            JSON.stringify(this.archiveFolder)
          );
        } else {
          const folder = sessionStorage.getItem('archiveFolder');
          if (folder) {
            this.archiveFolder = JSON.parse(folder);
          }
        }
      });
    console.log(this.archiveFolder);
    this.barCode = {
          ...this.barCode,
          archiveFolderId: this.id as number,
        };
    this.getArchiveFolders(this.archiveFolder.id);
    this.changeFolderStatus();
  }




  onSubmit(): void {
    const data = { ...this.barCode };
    this.barcodeApiService.save(data).subscribe({
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

  getArchiveFolders($event: LazyLoadEvent) {
    this.archiveFolderService
      .loadArchiveFolder($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.archiveFolders$$.next(response.data);
        this.totalRecords = response.total;
        this.cd.detectChanges();
      });
  }
  loadRows($event: LazyLoadEvent) {
    this.barcodeApiService
      .loadArchiveExams($event, this.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.barcodes = response.data;
        this.barCodes$$.next(response.data);
        this.totalRecords = response.total;
        this.cd.detectChanges();
      });
  }
}
