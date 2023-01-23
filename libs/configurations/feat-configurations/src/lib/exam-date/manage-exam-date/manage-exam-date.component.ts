import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';

import {
  ExamDateApiService,
  ExamSiteApiService,
  ExamTypeApiService,
} from '@msh/configurations/data-access-configurations';
import {ExamDate} from '@msh/configurations/domain-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';

import {
  GlobalToastService,
  GridEvent,
  GRID_ACTIONS,
} from '@msh/shared/util-shared';

import { BehaviorSubject } from 'rxjs';
import { ExamDateFormComponent } from '../exam-date-form/exam-date-form.component';
import { ExamDateGridComponent } from '../exam-date-grid/exam-date-grid.component';

@UntilDestroy()
@Component({
  selector: 'msh-manage-exam-date',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ExamDateFormComponent,
    ExamDateGridComponent,
    ToolbarModule,
  ],
  templateUrl: './manage-exam-Date.component.html',
  styleUrls: ['./manage-exam-Date.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageExamDateComponent implements OnInit {
  private examDates$$ = new BehaviorSubject<ExamDate[]>([]);
  examDates$ = this.examDates$$.asObservable();
  filters: LazyLoadEvent | null = null;

  totalRecords = 0;
  selectedExamDate: ExamDate | null = null;
  selectedExamDates: ExamDate[] = [];
  displayModal = false;
  examSites: DropdownModel<number>[] = [];
  examTypes: DropdownModel<number>[] = [];

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly examDateService: ExamDateApiService,
    private readonly examSitesApiService: ExamSiteApiService,
    private readonly examTypesApiService: ExamTypeApiService,
  ) {}

  ngOnInit(): void {
    this.getExamTypesDropdown();
    this.getExamSitesDropdown();
  }

  onNewClick() {
    this.displayModal = true;
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Jeni i sigurt që doni të fshini datat e provimit të zgjedhura?',
      accept: () => {
        this.toastService.showWarning('Datat e provimit të zgjedhura u fshinë!');
      },
    });
  }

  onGridEvent(event: GridEvent<ExamDate | ExamDate[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedExamDates = [
          ...this.selectedExamDates,
          event.data as ExamDate,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedExamDates = this.selectedExamDates.filter(ed => {
          ed.id !== (event.data as ExamDate).id;
        });
        break;

      case GRID_ACTIONS.SELECT_MANY:
        this.selectedExamDates = [
          ...this.selectedExamDates,
          ...(event.data as ExamDate[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedExamDates = [];
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedExamDate = Object.assign({}, event.data as ExamDate);
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt që doni të fshini datën e provimit të zgjedhur?',
          accept: () => {
            this.deleteExamDate(event.data as ExamDate);
          },
        });
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
  }

  onFormSave(examDate: ExamDate) {
    if (examDate.id) {
      this.upDateExamDate(examDate);
    }
    if (!examDate.id) {
      this.addExamDate(examDate);
    }
  }

  getExamDates($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.examDateService
      .loadExamDates($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examDates$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  addExamDate(examDate: ExamDate) {
    this.examDateService
      .save(examDate)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Data e provimit u shtua me sukses!');
          this.displayModal = false;
          this.getExamDates(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të datës së provimit!'
          );
      });
  }

  upDateExamDate(examDate: ExamDate) {
    this.examDateService
      .update(examDate)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            'Data e provimit u ndryshua me sukses!'
          );
          this.displayModal = false;
          this.getExamDates(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së datës së provimit!'
          );
      });
  }

  deleteExamDate(examDate: ExamDate) {
    this.examDateService
      .delete(examDate.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Data e provimit u fshi me sukses!');
          this.getExamDates(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes të datës së provimit!'
          );
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

  getExamSitesDropdown() {
    this.examSitesApiService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examSites = response.data;
      });
  }
}
