import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ExamTypeApiService,
  ExamVariantApiService,
} from '@msh/configurations/data-access-configurations';
import { ArchiveFolderApiService } from '@msh/evaluations/data-access-evaluations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ArchiveFolder } from '@msh/shared/domain-models';
import {
  GRID_ACTIONS,
  GlobalToastService,
  GridEvent,
} from '@msh/shared/util-shared';
import { untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { StepsModule } from 'primeng/steps';
import { TableLazyLoadEvent } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { BehaviorSubject } from 'rxjs';
import { ArchiveFolderCoverGridComponent } from '../archive-folder-cover-grid/archive-folder-cover-grid.component';

@Component({
  selector: 'msh-manage-archive-folder-cover',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ArchiveFolderCoverGridComponent,
    ToolbarModule,
    StepsModule,
    ToastModule,
    RippleModule,
  ],
  templateUrl: './manage-archive-folder-cover.component.html',
  styleUrls: ['./manage-archive-folder-cover.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageArchiveFolderCoverComponent implements OnInit {
  private archiveFolders$$ = new BehaviorSubject<ArchiveFolder[]>([]);
  archiveFolders$ = this.archiveFolders$$.asObservable();
  filters: TableLazyLoadEvent | null = null;
  totalRecords = 0;

  selectedArchiveFolder: ArchiveFolder | null = null;
  selectedArchiveFolders: ArchiveFolder[] = [];
  displayModal = false;
  examType: DropdownModel<number>[] = [];
  examVariant: DropdownModel<number>[] = [];
  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly archiveFolderService: ArchiveFolderApiService,
    private readonly examTypeApiService: ExamTypeApiService,
    private readonly examVariantApiService: ExamVariantApiService,
    private router: Router
  ) { }
  items: MenuItem[] | any;

  ngOnInit() {
    this.items = [
      { label: 'Hapni menunë më poshtë.' },
      { label: 'Eksportoni në PDF' },
      { label: 'Printoni PDF-në' },
      { label: 'Firmosni formularin' },
    ];
    this.getExamTypeDropdown();
  }

  onNewClick() {
    this.displayModal = true;
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
        // eslint-disable-next-line max-len
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

  getArchiveFolders($event: TableLazyLoadEvent) {
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
          this.getArchiveFolders(this.filters as TableLazyLoadEvent);
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
          this.getArchiveFolders(this.filters as TableLazyLoadEvent);
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
          this.getArchiveFolders(this.filters as TableLazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes së dosjes!'
          );
      });
  }

  getExamTypeDropdown() {
    this.examTypeApiService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examType = response.data;
      });
  }
}
