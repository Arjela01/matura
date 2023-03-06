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
import {
  GlobalToastService,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ExamTypeApiService } from '@msh/configurations/data-access-configurations';
import {
  ArchiveExamApiService,
  ArchiveFolderApiService,
} from '@msh/evaluations/data-access-evaluations';
import {
  ArchiveExam,
  ArchiveFolder,
} from '@msh/evaluations/domain-evaluations';
import {BarcodeCorrectionGridComponent} from "../barcode-correction-grid/barcode-correction-grid.component";
import {BarcodeCorrectionFormComponent} from "../barcode-correction-form/barcode-correction-form.component";
import {BarcodeService} from "../../archive-exam/services/barcode-service";
import {DropdownModel} from "@msh/shared/data-access-shared";

@UntilDestroy()
@Component({
  selector: 'msh-manage-barcode-correction',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    BarcodeCorrectionFormComponent,
    ToolbarModule,
    RouterLink,
    BarcodeCorrectionGridComponent,
  ],
  templateUrl: './manage-barcode-correction.component.html',
  styleUrls: ['./manage-barcode-correction.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],

})
export class ManageBarcodeCorrectionComponent implements OnInit {
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
  examTypes: DropdownModel<number>[] = [];
  archiveFolders: DropdownModel<any>[] = [];

  selectedArchiveExam: ArchiveExam | null = null;
  selectedArchiveExams: ArchiveExam[] = [];
  displayModal = false;
  archiveExam: ArchiveExam = {
    id: undefined,
    index: 0,
    archiveFolderId: 0,
    barcode: '',
  };
  id: any;
  archiveFolder: ArchiveFolder = {} as ArchiveFolder;
  isBarcodeInputDisabled = false;

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
    private barcodeService: BarcodeService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.archiveFolder = {};
  }

  ngOnInit() {
    this.getExamTypes();
    this.getArchiveFolders();
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
        this.archiveExams$$.next([]);
        this.archiveExams$$.next(response.data);
        this.totalRecords = response.total;
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
      .changeFolderStatus(this.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.router.navigate(['./evaluations/archive-folder-cover', this.id]);
          this.toastService.showSuccess(
            this.archiveFolder?.isClosed
              ? 'Dosja u hap me sukses!'
              : 'Dosja u mbyll me sukses!'
          );

          this.displayModal = false;
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
  getExamTypes() {
    this.examTypeApiService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examTypes = response.data;
      });
  }

  getArchiveFolders() {
    this.archiveFolderService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.archiveFolders = response.data;
      });
  }

}
