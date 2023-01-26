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
  ExamTypeApiService, ExamVersionApiService,

} from '@msh/configurations/data-access-configurations';
import {ArchiveFolder} from '@msh/configurations/domain-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';

import {
  GlobalToastService,
  GridEvent,
  GRID_ACTIONS,
} from '@msh/shared/util-shared';

import { BehaviorSubject } from 'rxjs';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {BarCodeFormComponent} from "../bar-code-form/bar-code-form.component";
import {BarCodeGridComponent} from "../bar-code-grid/bar-code-grid.component";

@UntilDestroy()
@Component({
  selector: 'msh-manage-bar-codes',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    BarCodeFormComponent,
    BarCodeGridComponent,
    ToolbarModule,
    RouterLink,
  ],
  templateUrl: './manage-bar-codes.component.html',
  styleUrls: ['./manage-bar-codes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageBarCodesComponent implements OnInit {
  private archiveFolders$$ = new BehaviorSubject<ArchiveFolder[]>([]);
  archiveFolders$ = this.archiveFolders$$.asObservable();
  filters: LazyLoadEvent | null = null;
  hideArchiveFolderForm = true;
  saving= true;
  totalRecords = 0;

  selectedArchiveFolder: ArchiveFolder | null = null;
  selectedArchiveFolders: ArchiveFolder[] = [];
  displayModal = false;
  examType: DropdownModel<number>[] = [];
  examVersion : DropdownModel<number>[] = [];
  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly archiveFolderService: ArchiveFolderApiService,
    private readonly examTypeApiService: ExamTypeApiService,
    private readonly examVersionApiService: ExamVersionApiService,
    private router: Router

  ) {
  }

  ngOnInit(): void {
    this.getExamTypeDropdown();
    this.getExamVersionDropdown();

  }

  onCloseClick(){
    this.router.navigate(['/configurations/students']).then();
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
        // eslint-disable-next-line max-len
        this.selectedArchiveFolder = Object.assign({}, event.data as ArchiveFolder);
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt që doni të fshini shkollën e zgjedhur?',
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
          this.toastService.showSuccess('Shkolla e mesme u shtua me sukses!');
          this.displayModal = false;
          this.getArchiveFolders(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së shkollës së mesme!'
          );
      });
  }

  updateArchiveFolder(archiveFolder: ArchiveFolder) {
    this.archiveFolderService
      .update(archiveFolder)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            'Shkolla e mesme u ndryshua me sukses!'
          );
          this.displayModal = false;
          this.getArchiveFolders(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së shkollës së mesme!'
          );
      });
  }

  deleteArchiveFolder(archiveFolder: ArchiveFolder) {
    this.archiveFolderService
      .delete(archiveFolder.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Shkolla e mesme u fshi me sukses!');
          this.getArchiveFolders(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes së shkollës së mesme!'
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
  getExamVersionDropdown() {
    this.examVersionApiService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examVersion = response.data;
      });
  }
}
