import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { DropdownModel } from '@msh/shared/data-access-shared';
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

import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthFacade } from '@msh/auth/data-access-auth';
import {
  ExamSubjectApiService,
  ExamTypeApiService,
} from '@msh/configurations/data-access-configurations';
import {
  ArchiveExamApiService,
  ArchiveFolderApiService,
} from '@msh/evaluations/data-access-evaluations';
import { ArchiveFolder } from '@msh/evaluations/domain-evaluations';
import {
  GRID_ACTIONS,
  GlobalToastService,
  GridEvent,
} from '@msh/shared/util-shared';
import { RippleModule } from 'primeng/ripple';
import { BehaviorSubject, combineLatest, map, tap } from 'rxjs';
import { ArchiveFolderGridComponent } from '../archive-folder-grid/archive-folder-grid.component';
import { ArchiveOpenFolderFormComponent } from '../archive-open-folder-form/archive-open-folder-form.component';
import { AcademicYear } from '@msh/shared/domain-models';

@UntilDestroy()
@Component({
  selector: 'msh-manage-archive-folders',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ArchiveFolderGridComponent,
    ArchiveOpenFolderFormComponent,
    ToolbarModule,
    RouterLink,
    RippleModule,
  ],
  templateUrl: './manage-archive-folders.component.html',
  styleUrls: ['./manage-archive-folders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageArchiveFoldersComponent implements OnInit {
  private archiveFolders$$ = new BehaviorSubject<ArchiveFolder[]>([]);
  examTypes: DropdownModel<number>[] = [];
  examSubjects: DropdownModel<string>[] = [];

  archiveFolders$ = this.archiveFolders$$.asObservable();
  filters: LazyLoadEvent | null = null;

  totalRecords = 0;
  id: any;
  selectedArchiveFolder: ArchiveFolder | null = null;
  selectedArchiveFolders: ArchiveFolder[] = [];
  displayModal = false;
  currentAcademicYear?: Partial<AcademicYear>;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly examTypeApiService: ExamTypeApiService,
    private readonly addBarcodeService: ArchiveExamApiService,
    private archiveFolderService: ArchiveFolderApiService,
    private readonly examSubjectApiService: ExamSubjectApiService,
    private router: Router,
    private http: HttpClient,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private authFacade: AuthFacade
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }
  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    map(([academicYear]) => {
      this.currentAcademicYear = academicYear;
      if (this.filters) {
        this.getArchiveFolders(this.filters as LazyLoadEvent);
      }
    }),
    tap()
  );
  ngOnInit() {
    this.getExamTypes();
  }

  onNewClick() {
    this.displayModal = true;
    this.selectedArchiveFolder = {
      isFall: this.currentAcademicYear?.isFall ?? false,
    } as ArchiveFolder;
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Jeni i sigurt që doni të fshini dosjen?',
      accept: () => {
        this.toastService.showWarning('Dosja u fshi!');
      },
    });
  }

  onGridEvent(event: GridEvent<ArchiveFolder | ArchiveFolder[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedArchiveFolders = [
          ...this.selectedArchiveFolders,
          event.data as ArchiveFolder,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedArchiveFolders = this.selectedArchiveFolders.filter(hs => {
          hs.id !== (event.data as ArchiveFolder).id;
        });
        break;

      case GRID_ACTIONS.SELECT_MANY:
        this.selectedArchiveFolders = [
          ...this.selectedArchiveFolders,
          ...(event.data as ArchiveFolder[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedArchiveFolders = [];
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedArchiveFolder = Object.assign(
          {},
          event.data as ArchiveFolder
        );
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt që doni të fshini dosjen e zgjedhur?',
          accept: () => {
            this.deleteArchiveFolder(event.data as ArchiveFolder);
          },
        });
        break;
      case GRID_ACTIONS.CUSTOM_ACTION1:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt që doni të ndryshoni statusin e dosjes?',
          accept: () => {
            this.changeFolderStatus(event.data as ArchiveFolder);
          },
        });
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
  }

  onFormSave(archiveFolder: ArchiveFolder) {
    if (archiveFolder.id) {
      this.updateArchiveFolder(archiveFolder);
    }
    if (!archiveFolder.id) {
      this.addArchiveFolder(archiveFolder);
    }
  }

  getArchiveFolders($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.archiveFolderService
      .loadArchiveFolder($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.archiveFolders$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  addArchiveFolder(archiveFolder: ArchiveFolder) {
    this.archiveFolderService
      .save({ ...archiveFolder, id: 0 })
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Dosja u shtua me sukses!');

          this.displayModal = false;
          this.router.navigate([
            '/evaluations',
            'archive-exams',
            response.data.id,
          ]);
        }
        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të dosjes!'
          );
      });
  }

  updateArchiveFolder(archiveFolder: ArchiveFolder) {
    this.archiveFolderService
      .update(archiveFolder)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Dosja u ndryshua me sukses!');
          this.displayModal = false;
          this.getArchiveFolders(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të dosjes!'
          );
      });
  }

  changeFolderStatus(archiveFolder: ArchiveFolder) {
    this.archiveFolderService
      .changeFolderStatus(archiveFolder.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            !archiveFolder.isClosed
              ? 'Dosja u mbyll me sukses!'
              : 'Dosja u hap me sukses!'
          );

          this.displayModal = false;
          this.getArchiveFolders(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të dosjes!'
          );
      });
  }

  deleteArchiveFolder(archiveFolder: ArchiveFolder) {
    this.archiveFolderService
      .delete(archiveFolder.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Dosja u fshi me sukses!');
          this.getArchiveFolders(this.filters as LazyLoadEvent);
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

  getExamSubjects(id: any) {
    this.examSubjectApiService
      .forExamType(id, undefined, undefined, undefined, true)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examSubjects = response.data;
      });
  }
}
