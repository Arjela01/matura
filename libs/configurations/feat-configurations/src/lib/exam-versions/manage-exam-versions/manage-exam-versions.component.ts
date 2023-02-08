import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import {
  GlobalToastService,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { ExamVersion } from '@msh/shared/domain-models';

import { BehaviorSubject } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  ExamTypeApiService,
  ExamVersionApiService,
  ProfileGroupApiService,
} from '@msh/configurations/data-access-configurations';
import { ExamVersionFormComponent } from '../exam-version-form/exam-version-form.component';
import { ExamVersionGridComponent } from '../exam-version-grid/exam-version-grid.component';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { RippleModule } from 'primeng/ripple';

@UntilDestroy()
@Component({
  selector: 'msh-manage-exam-versions',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ExamVersionFormComponent,
    ExamVersionGridComponent,
    ToolbarModule,
    RippleModule,
  ],
  templateUrl: './manage-exam-versions.component.html',
  styleUrls: ['./manage-exam-versions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageExamVersionsComponent implements OnInit {
  examVersions$$ = new BehaviorSubject<ExamVersion[]>([]);
  examVersions$ = this.examVersions$$.asObservable();
  filters: LazyLoadEvent | null = null;

  totalRecords = 0;
  selectedExamVersion: ExamVersion | null = null;
  selectedExamVersions: ExamVersion[] = [];
  displayModal = false;
  profileGroups: DropdownModel<number>[] = [];
  examTypes: DropdownModel<number>[] = [];

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly examVersionService: ExamVersionApiService,
    private readonly profileGroupApiService: ProfileGroupApiService,
    private readonly examTypesApiService: ExamTypeApiService
  ) {}

  ngOnInit(): void {
    this.getProfileGroupsDropdown();
    this.getExamTypesDropdown();
  }

  onNewClick() {
    this.displayModal = true;
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message:
        'Jeni i sigurt që doni të fshini versionet e provimeve të zgjedhura?',
      accept: () => {
        // this.examVersionStore.deleteSelectedExamVersions();
        this.toastService.showWarning('Versionet e provimeve u fshinë!');
      },
    });
  }

  onGridEvent(event: GridEvent<ExamVersion | ExamVersion[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedExamVersions = [
          ...this.selectedExamVersions,
          event.data as ExamVersion,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedExamVersions = this.selectedExamVersions.filter(hs => {
          hs.id !== (event.data as ExamVersion).id;
        });
        break;
      case GRID_ACTIONS.SELECT_MANY:
        this.selectedExamVersions = [
          ...this.selectedExamVersions,
          ...(event.data as ExamVersion[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedExamVersions = [];
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedExamVersion = Object.assign({}, event.data as ExamVersion);
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message:
            'Jeni i sigurt që doni të fshini versionin e provimit të zgjedhur?',
          accept: () => {
            this.deleteExamVersion(event.data as ExamVersion);
          },
        });
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
  }

  onFormSave(examVersion: ExamVersion) {
    if (examVersion.id) {
      this.updateExamVersion(examVersion);
    }
    if (!examVersion.id) {
      this.addExamVersion(examVersion);
    }
    this.displayModal = false;
  }

  getExamVersions($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.examVersionService
      .loadExamVersions($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examVersions$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  addExamVersion(examVersion: ExamVersion) {
    this.examVersionService
      .save(examVersion)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            'Versioni i proimit u shtua me sukses!'
          );
          this.displayModal = false;
          this.getExamVersions(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së versionit të provimit!'
          );
      });
  }

  updateExamVersion(examVersion: ExamVersion) {
    this.examVersionService
      .update(examVersion)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            'Versioni i provimit u ndryshua me sukses!'
          );
          this.displayModal = false;
          this.getExamVersions(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së versionit të provimit!'
          );
      });
  }

  deleteExamVersion(examVersion: ExamVersion) {
    this.examVersionService
      .delete(examVersion.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Versioni i provimit u fshi me sukses!');
          this.getExamVersions(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes së versionit të provimit!'
          );
      });
  }

  getProfileGroupsDropdown() {
    this.profileGroupApiService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.profileGroups = response.data;
      });
  }
  getExamTypesDropdown() {
    this.examTypesApiService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examTypes = response.data;
      });
  }
}
