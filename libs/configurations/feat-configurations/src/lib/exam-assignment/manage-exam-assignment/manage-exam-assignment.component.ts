import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { Router } from '@angular/router';

import {
  ExamAssignmentApiService,
  ExamDateApiService,
  ExamSiteApiService,
} from '@msh/configurations/data-access-configurations';

import { ExamAssignment } from '@msh/configurations/domain-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';

import {
  GlobalToastService,
  GridEvent,
  GRID_ACTIONS,
} from '@msh/shared/util-shared';

import { BehaviorSubject } from 'rxjs';
import { ExamAssignmentGridComponent } from '../exam-assignment-grid/exam-assignment-grid.component';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { FileUploadModule } from 'primeng/fileupload';
import { ExamAssignmentFormComponent } from '../exam-assignment-form/exam-assignment-form.component';

@UntilDestroy()
@Component({
  selector: 'msh-manage-exam-assignment',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ExamAssignmentGridComponent,
    ExamAssignmentFormComponent,
    ToolbarModule,
    FileUploadModule,
  ],
  templateUrl: './manage-exam-assignment.component.html',
  styleUrls: ['./manage-exam-assignment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageExamAssignmentComponent implements OnInit {
  private examAssignments$$ = new BehaviorSubject<ExamAssignment[]>([]);
  examAssignments$ = this.examAssignments$$.asObservable();
  filters: LazyLoadEvent | null = null;

  totalRecords = 0;
  selectedExamAssignment: ExamAssignment | null = null;
  selectedExamAssignments: ExamAssignment[] = [];
  displayModal = false;

  examAssignments: DropdownModel<number>[] = [];
  examDates: DropdownModel<number>[] = [];
  examSites: DropdownModel<number>[] = [];
  base64: string | ArrayBuffer | null | undefined;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly examAssignmentService: ExamAssignmentApiService,
    private readonly examDateService: ExamDateApiService,
    private readonly examSiteService: ExamSiteApiService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.getExamDateDropdown();
    this.getExamSiteDropdown();
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message:
        'Jeni i sigurt që doni të fshini caktimet ne qendrat e provimit të zgjedhura?',
      accept: () => {
        this.toastService.showWarning(
          'Caktimet në qendrat e provimit u fshinë!'
        );
      },
    });
  }

  onGridEvent(event: GridEvent<ExamAssignment | ExamAssignment[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedExamAssignments = [
          ...this.selectedExamAssignments,
          event.data as ExamAssignment,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedExamAssignments = this.selectedExamAssignments.filter(
          ea => {
            ea.id !== (event.data as ExamAssignment).id;
          }
        );
        break;

      case GRID_ACTIONS.SELECT_MANY:
        this.selectedExamAssignments = [
          ...this.selectedExamAssignments,
          ...(event.data as ExamAssignment[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedExamAssignments = [];
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedExamAssignment = Object.assign(
          {},
          event.data as ExamAssignment
        );
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message:
            'Jeni i sigurt që doni të fshini caktimin në qendrën e provimit të zgjedhur?',
          accept: () => {
            this.deleteExamAssignment(event.data as ExamAssignment);
          },
        });
        break;
    }
  }
  onNewClick() {
    this.displayModal = true;
  }
  onModalClose() {
    this.displayModal = false;
  }

  onFormSave(examAssignment: ExamAssignment) {
    if (examAssignment.id) {
      this.updateExamAssignment(examAssignment);
    }
    if (!examAssignment.id) {
      this.addExamAssignment(examAssignment);
    }
  }

  getExamAssignments($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.examAssignmentService
      .loadExamAssignments($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examAssignments$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  addExamAssignment(examAssignment: ExamAssignment) {
    this.examAssignmentService
      .save(examAssignment)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            'Caktimi në Qender Provimi  u shtua me sukses!'
          );
          this.displayModal = false;
          this.getExamAssignments(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të caktimit në qender të provimit!'
          );
      });
  }

  updateExamAssignment(examAssignment: ExamAssignment) {
    this.examAssignmentService
      .update(examAssignment)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            'Caktimi në Qender Provimi u ndryshua me sukses!'
          );
          this.displayModal = false;
          this.getExamAssignments(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të caktimit në qender të provimit!'
          );
      });
  }

  deleteExamAssignment(examAssignment: ExamAssignment) {
    this.examAssignmentService
      .delete(examAssignment.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo(
            'Caktimi në qendrën  e provimit u fshi me sukses!'
          );
          this.getExamAssignments(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes të caktimit ne qendrën e provimit!'
          );
      });
  }

  getExamDateDropdown() {
    this.examDateService
      .loadDropdownList()
      .pipe()
      .subscribe(response => {
        this.examDates = response.data;
      });
  }
  getExamSiteDropdown() {
    this.examSiteService
      .loadDropdownList()
      .pipe()
      .subscribe(response => {
        this.examSites = response.data;
      });
  }

  onUpload(event: any) {
    const file = event.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      this.base64 = base64.split(',')[1];
      this.examAssignmentService
        .uploadExcelFile(this.base64)
        .subscribe(response => {
          if (response.isSuccessful) {
            this.toastService.showSuccess('Dokumenti u shtua me sukses!');
          }
          if (response.isBadRequest)
            this.toastService.showError(
              'Ndodhi një problem gjatë ngarkimit të dokumentit!'
            );
          console.log(111, response);
        });
    };
  }
}
