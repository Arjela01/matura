import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';

import {
  ArchiveFolderApiService,
  ExamSubjectApiService,
  ExamTypeApiService,
} from '@msh/configurations/data-access-configurations';
import { ArchiveFolder } from '@msh/configurations/domain-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';

import {
  GlobalToastService,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';

import { BehaviorSubject } from 'rxjs';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { ArchiveFolderGridComponent } from '../archive-folder-grid/archive-folder-grid.component';
import { ArchiveOpenFolderFormComponent } from '../archive-open-folder-form/archive-open-folder-form.component';
import { RippleModule } from 'primeng/ripple';

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
  examSubjects: DropdownModel<number>[] = [];

  archiveFolders$ = this.archiveFolders$$.asObservable();
  filters: LazyLoadEvent | null = null;

  totalRecords = 0;
  id:any;
  selectedArchiveFolder: ArchiveFolder | null = null;
  selectedArchiveFolders: ArchiveFolder[] = [];
  displayModal = false;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly archiveFolderService: ArchiveFolderApiService,
    private readonly examTypeApiService: ExamTypeApiService,
    private readonly examSubjectApiService: ExamSubjectApiService,

    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.paramMap.get('id');

  }

  ngOnInit(): void {
    this.getExamTypes();
    this.getExamSubjects();
  }

  onNewClick() {
    this.displayModal = true;
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Jeni i sigurt që doni të fshini shkollat e zgjedhura?',
      accept: () => {
        //this.highSchoolStore.deleteSelectedHighSchools();
        this.toastService.showWarning('Shkollat e zgjedhura u fshinë!');
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

        // this.getExamSubjects(this.selectedArchiveFolder.examTypeId);
        // this.getExamVersions(this.selectedArchiveFolder.examSubjectId ?? '');
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
      case GRID_ACTIONS.CHANGE:
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
      .save(archiveFolder)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Dosja u shtua me sukses!');
          this.displayModal = false;
          this.getArchiveFolders(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së dosjes!'
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
            'Ndodhi një problem gjatë ndryshimit së dosjes!'
          );
      });
  }

  changeFolderStatus(archiveFolder: ArchiveFolder) {
    this.archiveFolderService
      .changeFolderStatus(archiveFolder)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            !archiveFolder.isClosed ? 'Dosja u mbyll me sukses!' : 'Dosja u aktivizua me sukses!');

          this.displayModal = false;
          this.getArchiveFolders(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së dosjes!'
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

  getExamSubjects() {
    this.examSubjectApiService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examSubjects = response.data;
      });
  }

  //   getExamVersions(examSubjectId: string) {
  //     this.examVersionApiService
  //       .forExamSubject(examSubjectId)
  //       .pipe(untilDestroyed(this))
  //       .subscribe(response => {
  //         this.examVersions = response.data;
  //       });
  //   }
  // }

  //   onExamTypeChanged(examTypeId: any) {
  //     if (this.selectedArchiveFolder != null)
  //       this.selectedArchiveFolder.examTypeId = examTypeId;
  //     this.getExamSubjects(examTypeId);
  //     this.examVersions = [];
  //   }
  //
  //   onExamSubjectChanged(examSubjectId: string) {
  //     if (this.selectedArchiveFolder != null)
  //       this.selectedArchiveFolder.examSubjectId = examSubjectId;
  //     this.getExamVersions(examSubjectId);
  //   }
  // }
}
