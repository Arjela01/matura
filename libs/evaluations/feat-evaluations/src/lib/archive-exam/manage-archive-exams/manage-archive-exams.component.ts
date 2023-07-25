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
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthFacade } from '@msh/auth/data-access-auth';
import {
  ExamTypeApiService,
  ReportsApiService,
} from '@msh/configurations/data-access-configurations';
import {
  ArchiveExamApiService,
  ArchiveFolderApiService,
} from '@msh/evaluations/data-access-evaluations';
import {
  ArchiveExam,
  ArchiveFolder,
} from '@msh/evaluations/domain-evaluations';
import {
  GRID_ACTIONS,
  GlobalToastService,
  GridEvent,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { BehaviorSubject, combineLatest, map, tap } from 'rxjs';
import { ArchiveFormComponent } from '../archive-exam-form/archive-form.component';
import { ArchiveExamGridComponent } from '../archive-exam-grid/archive-exam-grid.component';
import { BarcodeService } from '../services/barcode-service';
import { Report } from '@msh/shared/domain-models';
@UntilDestroy()
@Component({
  selector: 'msh-manage-archive-exams',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ArchiveExamGridComponent,
    ToolbarModule,
    RouterLink,
    ArchiveFormComponent,
  ],
  templateUrl: './manage-archive-exams.component.html',
  styleUrls: ['./manage-archive-exams.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageArchiveExamsComponent implements OnInit {
  @Input() loading = false;
  @Input() set archiveExamsDetails(details: ArchiveExam | null) {
    if (details) {
      this.archiveExam = Object.assign({}, details);
    }
  }
  @Input() archiveExams: ArchiveExam[] = [];
  @Output() gridEvent = new EventEmitter<
    GridEvent<ArchiveExam | ArchiveFolder[]>
  >();
  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();
  @Output() formSave = new EventEmitter<ArchiveExam[] | ArchiveFolder[]>();
  @ViewChild('form', { static: true }) form!: NgForm;
  archiveExams$$ = new BehaviorSubject<ArchiveExam[]>([]);
  archiveExams$ = this.archiveExams$$.asObservable();
  filters: LazyLoadEvent | null = null;
  totalRecords = 0;
  selectedArchiveExam: ArchiveExam | null = null;
  selectedArchiveExams: ArchiveExam[] = [];
  displayModal = false;
  archiveExam: ArchiveExam = {
    archiveFolderNr: 0,
    id: undefined,
    index: 0,
    archiveFolderId: 0,
    barcode: '',
  };
  id: any;
  archiveFolder: ArchiveFolder = {} as ArchiveFolder;
  isBarcodeInputDisabled = false;
  parameterUrl!: any;
  parameterYear!: any;
  archiveFolderReport: Report = Report.ArchiveFolder_Report;

  event = {
    first: 0,
    rows: 10,
    sortOrder: 1,
    filters: {},
    globalFilter: null,
  };

  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    map(([_]) => {
      if (this.filters) {
        this.getArchiveExams(this.filters as LazyLoadEvent);
      }
    }),
    tap()
  );
  constructor(
    private cd: ChangeDetectorRef,
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly examTypeApiService: ExamTypeApiService,
    private readonly archiveExamApiService: ArchiveExamApiService,
    private router: Router,
    private messageService: MessageService,
    private archiveFolderService: ArchiveFolderApiService,
    private route: ActivatedRoute,
    private barcodeService: BarcodeService,
    protected authFacade: AuthFacade,
    private reportApiService: ReportsApiService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.archiveFolder = {};
  }

  ngOnInit() {
    this.archiveFolderService
      .getById(this.id)
      .subscribe(folder => (this.archiveFolder = { ...folder.data }));

    this.authFacade.academicYear$.pipe(untilDestroyed(this)).subscribe(data => {
      this.getArchiveExams(this.event);
    });

    this.reportApiService
      .loadRoleReports(this.event)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        const archiveFolderData = res.data.find(item => {
          return item.reportId === 12;
        });
        const parametersArray = JSON.parse(
          archiveFolderData?.parameters as never
        );
        if (parametersArray.length > 0)
          this.parameterUrl = parametersArray.find((item: string) => {
            return ['foldernr'].includes(item.toLowerCase());
          });
        this.parameterYear = parametersArray.find((item: string) => {
          return ['academicyearid'].includes(item.toLowerCase());
        });
      });
  }

  onNewClick() {
    this.displayModal = true;
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Jeni i sigurt që doni të fshini barkodin e zgjedhur?',
      accept: () => {
        this.toastService.showWarning('Barkodi i zgjedhur u fshi!');
      },
    });
  }

  onGridEvent(event: GridEvent<ArchiveExam | ArchiveExam[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedArchiveExams = [
          ...this.selectedArchiveExams,
          event.data as ArchiveExam,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedArchiveExams = this.selectedArchiveExams.filter(hs => {
          hs.archiveFolderId !== (event.data as ArchiveExam).archiveFolderId;
        });
        break;

      case GRID_ACTIONS.SELECT_MANY:
        this.selectedArchiveExams = [
          ...this.selectedArchiveExams,
          ...(event.data as ArchiveExam[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedArchiveExams = [];
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedArchiveExam = Object.assign({}, event.data as ArchiveExam);
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt që doni të fshini barkodin e zgjedhur?',
          accept: () => {
            this.deleteArchiveExam(event.data as ArchiveExam);
          },
        });
        break;
      case GRID_ACTIONS.CUSTOM_ACTION1:
        this.addArchiveExams(event.data as ArchiveExam);
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
  }

  onFormSave(archiveExam: ArchiveExam) {
    if (archiveExam.barcode) {
      this.updateArchiveExam(archiveExam);
    }
    if (!archiveExam.barcode) {
      this.addArchiveExams(archiveExam);
    }
  }

  getArchiveExams($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);
    this.archiveExamApiService
      .loadArchiveExams($event, this.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.archiveExams = response.data;
        this.archiveExams$$.next(response.data);
        this.totalRecords = response.total;
        this.cd.markForCheck();

        if (response.total === 50 && this.archiveFolder.isClosed !== true) {
          this.changeFolderStatus();
        }
      });
  }

  addArchiveExams(archiveExam: ArchiveExam) {
    this.isBarcodeInputDisabled = true;

    this.archiveExamApiService
      .save(archiveExam)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.isBarcodeInputDisabled = false;

        if (response.isSuccessful) {
          this.toastService.showSuccess('Barkodi u ruajt me sukses!');
          this.displayModal = false;
          this.getArchiveExams(this.filters as LazyLoadEvent);
          this.barcodeService.emptyBarcodeField();
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë shtimit së barkodit!'
          );
        if (response.errorMessage) {
          this.toastService.showError(response.errorMessage);
        }
      })
      .add(() => {
        this.isBarcodeInputDisabled = false;
      });
  }

  updateArchiveExam(archiveExam: ArchiveExam) {
    this.archiveExamApiService
      .update(archiveExam)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Barkodi u ndryshua me sukses!');
          this.displayModal = false;
          this.getArchiveExams(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së barkodit!'
          );
        if (response.errorMessage) {
          this.toastService.showError(response.errorMessage);
        }
      });
  }

  changeFolderStatus() {
    this.archiveFolderService
      .changeFolderStatus(this.id, this.archiveFolder.isClosed)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            this.archiveFolder?.isClosed
              ? 'Dosja u hap me sukses!'
              : 'Dosja u mbyll me sukses!'
          );

          this.displayModal = false;
          const query: { queryParams: { [x: string]: string } } = {
            queryParams: {},
          };
          if (
            this.parameterUrl &&
            this.parameterYear &&
            this.archiveFolder.nr &&
            this.archiveFolder.academicYearId
          ) {
            query.queryParams[`${this.parameterUrl}`] = this.archiveFolder.nr;
            query.queryParams[`${this.parameterYear}`] =
              this.archiveFolder.academicYearId.toString();
          }
          this.router
            .navigate([`/reports/view/${this.archiveFolderReport}`], query)
            .then();
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së dosjes!'
          );
      });
  }

  deleteArchiveExam(archiveExam: ArchiveExam) {
    this.archiveExamApiService
      .delete(archiveExam.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Barkodi u fshi me sukses!');
          this.getArchiveExams(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes së dosjes!'
          );
      });
  }
}
