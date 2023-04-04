import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CarriedGrade } from '@msh/applications/domain-application';
import {
  CarriedGradeApiService,
  ExamTypeApiService,
} from '@msh/configurations/data-access-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';

import {
  GlobalToastService,
  GridEvent,
  GRID_ACTIONS,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { BehaviorSubject } from 'rxjs';
import { CarriedGradesFormComponent } from '../carried-grade-form/carried-grade-form.component';
import { CarriedGradesGridComponent } from '../carried-grade-grid/carried-grades-grid.component';

@Component({
  selector: 'msh-manage-carried-grades',
  standalone: true,
  templateUrl: './manage-carried-grade.component.html',
  styleUrls: ['./manage-carried-grade.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    CarriedGradesGridComponent,
    ToolbarModule,
    RippleModule,
    CarriedGradesFormComponent,
  ],
})
@UntilDestroy()
export class ManageCarriedGradesComponent implements OnInit {
  private carriedGrades$$ = new BehaviorSubject<CarriedGrade[]>([]);
  carriedGrades$ = this.carriedGrades$$.asObservable();
  filters: LazyLoadEvent = {} as LazyLoadEvent;

  totalRecords = 0;
  selectedCarriedGrade: CarriedGrade | null = null;
  selectedCarriedGrades: CarriedGrade[] = [];
  displayModal = false;

  examTypeDropdown: DropdownModel<number>[] = [];

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private carriedGradeApiService: CarriedGradeApiService,
    private examTypeApiService: ExamTypeApiService
  ) {}

  ngOnInit(): void {
    this.getExamTypeDropdown();
  }

  onNewClick() {
    this.displayModal = true;
    this.selectedCarriedGrade = {} as CarriedGrade;
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete selected grades?',
      accept: () => {
        this.toastService.showWarning('Carried Grades deleted!');
      },
    });
  }

  onGridEvent(event: GridEvent<CarriedGrade | CarriedGrade[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedCarriedGrades = [
          ...this.selectedCarriedGrades,
          event.data as CarriedGrade,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedCarriedGrades = this.selectedCarriedGrades.filter(rep => {
          rep.id !== (event.data as CarriedGrade).id;
        });
        break;
      case GRID_ACTIONS.SELECT_MANY:
        this.selectedCarriedGrades = [
          ...this.selectedCarriedGrades,
          ...(event.data as CarriedGrade[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedCarriedGrades = [];
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedCarriedGrade = Object.assign(
          {},
          event.data as CarriedGrade
        );
        this.displayModal = true;
        break;
      case GRID_ACTIONS.CUSTOM_ACTION2:
        this.downloadDocument(event.data as CarriedGrade);
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Jeni te sigurt per fshirjen e notës?',
          accept: () => {
            this.deleteCarriedGrades(event.data as CarriedGrade);
            this.toastService.showWarning('Nota u fshi!');
          },
        });
        break;
    }
  }

  downloadDocument(carriedGrade: CarriedGrade) {
    this.carriedGradeApiService.downloadDocument(carriedGrade);
  }

  onModalClose() {
    this.displayModal = false;
    this.selectedCarriedGrade = null;
  }

  onFormSave(carriedGrade: CarriedGrade) {
    if (carriedGrade.id) {
      this.updateCarriedGrades(carriedGrade);
    }
    if (!carriedGrade.id) {
      this.addCarriedGrades(carriedGrade);
    }
  }

  getCarriedGrades($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);
    this.carriedGradeApiService
      .loadCarriedGrades($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.carriedGrades$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  addCarriedGrades(carriedGrades: CarriedGrade) {
    this.carriedGradeApiService
      .save(carriedGrades)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Nota u shtua me sukses!');
          this.displayModal = false;
          this.getCarriedGrades(this.filters);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi nje problem gjatë ndryshimit të notës !'
          );
      });
  }

  updateCarriedGrades(carriedGrade: CarriedGrade) {
    this.carriedGradeApiService
      .update(carriedGrade)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Nota u ndryshua me sukses!');
          this.displayModal = false;
          this.getCarriedGrades(this.filters);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi nje problem gjatë ndryshimit të notës!'
          );
      });
  }

  deleteCarriedGrades(carriedGrade: CarriedGrade) {
    this.carriedGradeApiService
      .delete(carriedGrade.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Nota u fshi me sukses!');
          this.getCarriedGrades(this.filters);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi nje problem gjatë fshirjes së notës!'
          );
      });
  }

  getExamTypeDropdown() {
    this.examTypeApiService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examTypeDropdown = response.data;
      });
  }
}
