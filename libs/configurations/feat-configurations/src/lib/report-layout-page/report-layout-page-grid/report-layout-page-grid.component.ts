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

import { UntilDestroy } from '@ngneat/until-destroy';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';

import {
  AcademicYearApiService,
  GendersApiService,
  HighSchoolApiService,
  ProfileApiService,
  StudentsApiService,
} from '@msh/configurations/data-access-configurations';
import { ArchiveFolder } from '@msh/configurations/domain-configurations';

import { GridEvent, GRID_ACTIONS } from '@msh/shared/util-shared';

import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { StepsModule } from 'primeng/steps';

@UntilDestroy()
@Component({
  selector: 'msh-report-layout-page-grid',
  standalone: true,
  imports: [CommonModule, TableModule, FormsModule, ToastModule, StepsModule],
  templateUrl: './report-layout-page-grid.component.html',
  styleUrls: ['./report-layout-page-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ReportLayoutPageGridComponent {
  @Input() archiveFolders: ArchiveFolder[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;

  //Keep it local state because of Table Header checkbox not syncing
  selectedArchiveFolders: ArchiveFolder[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<ArchiveFolder | ArchiveFolder[]>
  >();

  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();

  @ViewChild('form', { static: true }) form!: NgForm;


  archiveFolder: ArchiveFolder = {
    isClosed: false, lastUserId: undefined,
    examTypeId: 0,
    id: 0
  };
  saving = false;

  onSubmit(): void {
    const data = { ...this.archiveFolder };

    // this.archiveFolderService.save(data).subscribe({
    //   next: () => {
    //     this.saving = false;

    //     this.router.navigate(['/configurations/students']).then();
    //   },
    // });
  }

  onEditClick(archiveFolder: ArchiveFolder) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: archiveFolder,
    } as GridEvent<ArchiveFolder>);
  }
  onActivate(archiveFolder: ArchiveFolder) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.EDIT,
      data: archiveFolder,
    } as GridEvent<ArchiveFolder>);
  }
  onDeleteClick(archiveFolder: ArchiveFolder) {
    this.gridEvent.emit({
      action: GRID_ACTIONS.DELETE,
      data: archiveFolder,
    } as GridEvent<ArchiveFolder>);
  }

  loadRows($event: LazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }
}
