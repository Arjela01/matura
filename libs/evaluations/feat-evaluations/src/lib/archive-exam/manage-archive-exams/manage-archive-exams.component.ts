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
  GridEvent,
  GRID_ACTIONS,
} from '@msh/shared/util-shared';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ArchiveExamGridComponent } from '../archive-exam-grid/archive-exam-grid.component';
import { NgForm } from '@angular/forms';
import { ArchiveFormComponent } from '../archive-exam-form/archive-form.component';
import {
  ExamTypeApiService,
  ExamVersionApiService,
  StudentsApiService,
} from '@msh/configurations/data-access-configurations';
import {
  ArchiveExamApiService,
  ArchiveFolderApiService,
} from '@msh/evaluations/data-access-evaluations';
import {
  ArchiveExam,
  ArchiveFolder,
} from '@msh/evaluations/domain-evaluations';

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
export class ManageArchiveExamsComponent {
  @Input() loading = false;

  @Output() gridEvent = new EventEmitter<
    GridEvent<ArchiveExam | ArchiveFolder[]>
  >();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  @Input() set barCodeDetails(details: ArchiveExam | null) {
    if (details) {
      this.barCode = Object.assign({}, details);
    }
  }

  @Output() formSave = new EventEmitter<ArchiveExam[] | ArchiveFolder[]>();

  @ViewChild('form', {static: true}) form!: NgForm;
  private archiveFolders$$ = new BehaviorSubject<ArchiveFolder[]>([]);

  private barCodes$$ = new BehaviorSubject<ArchiveExam[]>([]);
  barCodes$ = this.barCodes$$.asObservable();
  filters: LazyLoadEvent | null = null;
  totalRecords = 0;

  selectedBarCode: ArchiveExam | null = null;
  selectedBarCodes: ArchiveExam[] = [];
  displayModal = false;
  @Input() barCodes: ArchiveExam[] = [];

  constructor(
    private cd: ChangeDetectorRef,
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly examTypeApiService: ExamTypeApiService,
    private readonly archiveExamApiService: ArchiveExamApiService,
    private readonly examVersionApiService: ExamVersionApiService,
    private readonly studentAPITestService: StudentsApiService,
    private router: Router,
    private messageService: MessageService,
    private readonly archivefolder: ArchiveFolderApiService,
    private archiveFolderService: ArchiveFolderApiService,
    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  archiveFolder: ArchiveFolder = {
    isClosed: false,
    lastUserId: undefined,
    examTypeId: 0,
    examSubjectId: '',
  };
  barCode: ArchiveExam = {
    index: 0,
    archiveFolderId: 0,
    barcode: '',
  };
  id: any;

  onNewClick() {
    this.displayModal = true;
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Jeni i sigurt që doni të fshini barkodin e zgjedhur?',
      accept: () => {
        //this.highSchoolStore.deleteSelectedHighSchools();
        this.toastService.showWarning('Barkodi i  zgjedhur u fshi!');
      },
    });
  }

  changeStatus(folder: ArchiveExam): void {
    this.gridEvent.emit({
      action: GRID_ACTIONS.CHANGE,
      data: folder,
    } as GridEvent<ArchiveExam>);
  }

  onGridEvent(event: GridEvent<ArchiveExam | ArchiveExam[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedBarCodes = [
          ...this.selectedBarCodes,
          event.data as ArchiveExam,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedBarCodes = this.selectedBarCodes.filter(hs => {
          hs.archiveFolderId !== (event.data as ArchiveExam).archiveFolderId;
        });
        break;

      case GRID_ACTIONS.SELECT_MANY:
        this.selectedBarCodes = [
          ...this.selectedBarCodes,
          ...(event.data as ArchiveExam[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedBarCodes = [];
        break;
      case GRID_ACTIONS.EDIT:
        // eslint-disable-next-line max-len
        this.selectedBarCode = Object.assign({}, event.data as ArchiveExam);
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt që doni të fshini shkollën e zgjedhur?',
          accept: () => {
            this.deleteBarCode(event.data as ArchiveExam);
          },
        });
        break;
      case GRID_ACTIONS.CHANGE:
        this.confirmationService.confirm({
          message: 'Doni te shtoni Barkodin?',
          accept: () => {
            this.addBarCode(event.data as ArchiveExam);
          },
        });
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
  }

  onFormSave(barCode: ArchiveExam) {
    if (barCode.barcode) {
      this.updateBarCode(barCode);
    }
    if (!barCode.barcode) {
      this.addBarCode(barCode);
    }
  }

  getBarCodes($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.archiveExamApiService
      .loadArchiveExams($event, this.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.barCodes$$.next([]);
        this.barCodes$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  addBarCode(barCode: ArchiveExam) {
    this.archiveExamApiService
      .save(barCode)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Barkodi u shtua me sukses!');
          this.displayModal = false;
          this.getBarCodes(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së barkodit!'
          );
        if (this.totalRecords >= 50)
          this.toastService.showWarning(
            'Dosja ka tejkaluar limitin e 50 Provimeve!'
          );
      });
  }

  updateBarCode(barCode: ArchiveExam) {
    this.archiveExamApiService
      .update(barCode)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            'Shkolla e mesme u ndryshua me sukses!'
          );
          this.displayModal = false;
          this.getBarCodes(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së shkollës së mesme!'
          );
      });
  }

  deleteBarCode(barCode: ArchiveExam) {
    this.archiveExamApiService
      .delete(barCode.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Dosja u fshi me sukses!');
          this.getBarCodes(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes së dosjes!'
          );
      });
  }
}
