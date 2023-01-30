import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';

import { AcademicYearApiService } from '@msh/configurations/data-access-configurations';
import { AcademicYear } from '@msh/configurations/domain-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';

import {
  GlobalToastService,
  GridEvent,
  GRID_ACTIONS,
} from '@msh/shared/util-shared';

import { BehaviorSubject } from 'rxjs';
import { AcademicYearFormComponent } from '../academic-year-form/academic-year-form.component';
import { AcademicYearGridComponent } from '../academic-year-grid/academic-year-grid.component';
import {RippleModule} from "primeng/ripple";

@UntilDestroy()
@Component({
  selector: 'msh-manage-academic-year',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    AcademicYearFormComponent,
    AcademicYearGridComponent,
    ToolbarModule,
    RippleModule,
  ],
  templateUrl: './manage-academic-year.component.html',
  styleUrls: ['./manage-academic-year.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageAcademicYearComponent {
  private academicYears$$ = new BehaviorSubject<AcademicYear[]>([]);
  academicYears$ = this.academicYears$$.asObservable();
  filters: LazyLoadEvent | null = null;

  totalRecords = 0;
  selectedAcademicYear: AcademicYear | null = null;
  selectedAcademicYears: AcademicYear[] = [];
  displayModal = false;
  academicYears: DropdownModel<number>[] = [];

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly academicYearService: AcademicYearApiService
  ) {}

  onNewClick() {
    this.displayModal = true;
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Jeni i sigurt që doni të fshini vitet akademike te zgjedhura?',
      accept: () => {
        this.toastService.showWarning('Vitet akademike te zgjedhura u fshinë!');
      },
    });
  }

  onGridEvent(event: GridEvent<AcademicYear | AcademicYear[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedAcademicYears = [
          ...this.selectedAcademicYears,
          event.data as AcademicYear,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedAcademicYears = this.selectedAcademicYears.filter(ay => {
          ay.id !== (event.data as AcademicYear).id;
        });
        break;

      case GRID_ACTIONS.SELECT_MANY:
        this.selectedAcademicYears = [
          ...this.selectedAcademicYears,
          ...(event.data as AcademicYear[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedAcademicYears = [];
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedAcademicYear = Object.assign(
          {},
          event.data as AcademicYear
        );
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message:
            'Jeni i sigurt që doni të fshini vitin akademik të zgjedhur?',
          accept: () => {
            this.deleteAcademicYear(event.data as AcademicYear);
          },
        });
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
  }

  onFormSave(academicYear: AcademicYear) {
    if (academicYear.id) {
      this.updateAcademicYear(academicYear);
    }
    if (!academicYear.id) {
      this.addAcademicYear(academicYear);
    }
  }

  getAcademicYears($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.academicYearService
      .loadAcademicYears($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.academicYears$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  addAcademicYear(academicYear: AcademicYear) {
    this.academicYearService
      .save(academicYear)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Viti u shtua me sukses!');
          this.displayModal = false;
          this.getAcademicYears(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të vitit akademik!'
          );
      });
  }

  updateAcademicYear(academicYear: AcademicYear) {
    this.academicYearService
      .update(academicYear)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Viti u ndryshua me sukses!');
          this.displayModal = false;
          this.getAcademicYears(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të vitit akademik!'
          );
      });
  }

  deleteAcademicYear(academicYear: AcademicYear) {
    this.academicYearService
      .delete(academicYear.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Viti u fshi me sukses!');
          this.getAcademicYears(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes së vitit akademik!'
          );
      });
  }
}
