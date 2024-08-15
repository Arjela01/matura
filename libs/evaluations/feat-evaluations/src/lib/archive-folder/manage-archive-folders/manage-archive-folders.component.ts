import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { DropdownModel } from '@msh/shared/data-access-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  AuthFacade,
  PermissionCheckService,
  PermissionEnum,
} from '@msh/auth/data-access-auth';
import {
  ExamSubjectApiService,
  ExamTypeApiService,
} from '@msh/configurations/data-access-configurations';
import { ArchiveFolderApiService } from '@msh/evaluations/data-access-evaluations';
import { AcademicYear, ArchiveFolder } from '@msh/shared/domain-models';
import {
  GRID_ACTIONS,
  GlobalToastService,
  GridEvent,
} from '@msh/shared/util-shared';
import { RippleModule } from 'primeng/ripple';
import { TableLazyLoadEvent } from 'primeng/table';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  skip,
  tap,
} from 'rxjs';
import { ArchiveFolderGridComponent } from '../archive-folder-grid/archive-folder-grid.component';
import { ArchiveOpenFolderFormComponent } from '../archive-open-folder-form/archive-open-folder-form.component';
import { CustomSwitchComponent } from '@msh/layout/feat-layout';

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
    CustomSwitchComponent,
  ],
  templateUrl: './manage-archive-folders.component.html',
  styleUrls: ['./manage-archive-folders.component.scss'],
  providers: [ConfirmationService],
})
export class ManageArchiveFoldersComponent implements OnInit {
  private archiveFolders$$ = new BehaviorSubject<ArchiveFolder[]>([]);
  examTypes: DropdownModel<number>[] = [];
  examSubjects: DropdownModel<string>[] = [];

  archiveFolders$ = this.archiveFolders$$.asObservable().pipe();
  filters: TableLazyLoadEvent | null = null;

  totalRecords = 0;
  id: any;
  selectedArchiveFolder: ArchiveFolder | null = null;
  selectedArchiveFolders: ArchiveFolder[] = [];
  archiveFolder: ArchiveFolder = {} as ArchiveFolder;
  displayModal = false;
  isOn = false;
  currentAcademicYear!: Partial<AcademicYear>;

  folderNr: string | undefined;
  selectedRecord: any;
  headerText: any;
  displayHistoryForm = false;
  examTypeId = 0;
  showEditButton = false;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly examTypeApiService: ExamTypeApiService,
    private archiveFolderService: ArchiveFolderApiService,
    private readonly examSubjectApiService: ExamSubjectApiService,
    private router: Router,
    private route: ActivatedRoute,
    private authFacade: AuthFacade,
    private readonly permissionCheckService: PermissionCheckService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }
  changes$ = combineLatest([
    this.authFacade.academicYear$.pipe(skip(1)),
    this.authFacade.isFall$.pipe(
      tap(isFall => {
        this.isOn = isFall;
      })
    ),
  ])
    .pipe(
      distinctUntilChanged(),
      skip(1),
      untilDestroyed(this),
      tap(() => {
        if (this.filters) {
          this.getArchiveFolders(this.filters as TableLazyLoadEvent);
        }
      })
    )
    .subscribe();

  ngOnInit() {
    this.showEditButton = this.permissionCheckService.hasPermission(
      PermissionEnum.EditApplications as any
    );
    this.getExamTypes();
  }

  onSwitchChange(event: any) {
    this.isOn = event;
    this.getArchiveFolders(this.filters as TableLazyLoadEvent);
  }

  onNewClick() {
    this.displayModal = true;
    this.selectedArchiveFolder = {
      isFall: this.isOn ?? false,
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

  onGridEvent(event: GridEvent<any | ArchiveFolder[]>) {
    switch (event.action) {
      case GRID_ACTIONS.HISTORY:
        this.selectedRecord = Object.assign({}, event.data);
        this.folderNr = event.data.id;
        this.headerText = `Historiku për Dosjen {${event.data.nr}}`;
        this.displayHistoryForm = true;
        break;
      case GRID_ACTIONS.EDIT:
        this.examTypeId = event.data.examTypeId;
        this.getExamSubjects(this.examTypeId);
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

  getArchiveFolders($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    if (this.isOn) {
      this.filters.filters = {
        ...this.filters.filters,
        isFall: {
          value: this.isOn,
          matchMode: 'equals',
        },
      };
    } else {
      const { isFall, ...restFilters } = this.filters.filters || {};
      this.filters.filters = restFilters;
    }

    this.archiveFolderService
      .loadArchiveFolder(this.filters)
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
    const archiveFolderUpdateData = {
      id: archiveFolder.id,
      examSubjectId: archiveFolder.examSubjectId,
      examTypeId: this.examTypeId,
    };
    this.archiveFolderService
      .update(archiveFolderUpdateData)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Dosja u ndryshua me sukses!');
          this.displayModal = false;
          this.getArchiveFolders(this.filters as TableLazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të dosjes!'
          );
      });
  }

  changeFolderStatus(archiveFolder: ArchiveFolder) {
    this.archiveFolderService
      .changeFolderStatus(archiveFolder.id, archiveFolder.isClosed)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            !archiveFolder.isClosed
              ? 'Dosja u mbyll me sukses!'
              : 'Dosja u hap me sukses!'
          );

          this.displayModal = false;
          this.getArchiveFolders(this.filters as TableLazyLoadEvent);
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
          this.getArchiveFolders(this.filters as TableLazyLoadEvent);
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
