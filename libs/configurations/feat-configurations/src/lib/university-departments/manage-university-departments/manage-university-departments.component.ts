import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';

import { UniversityDepartment } from '@msh/configurations/domain-configurations';

import {
  GlobalToastService,
  GridEvent,
  GRID_ACTIONS,
} from '@msh/shared/util-shared';

import { BehaviorSubject } from 'rxjs';
import { RippleModule } from 'primeng/ripple';
import { UniversityDepartmentGridComponent } from '../university-department-grid/university-department-grid.component';
import { UniversityDepartmentFormComponent } from '../university-department-form/university-department-form.component';
import {UniversityDepartmentApiService} from "@msh/configurations/data-access-configurations";

@UntilDestroy()
@Component({
  selector: 'msh-manage-university-departments',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    UniversityDepartmentGridComponent,
    UniversityDepartmentFormComponent,
    ToolbarModule,
    RippleModule,
  ],
  templateUrl: './manage-universityDepartment-departments.component.html',
  styleUrls: ['./manage-universityDepartment-departments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageUniversityDepartmentsComponent {
  private universityDepartments$$ = new BehaviorSubject<UniversityDepartment[]>(
    []
  );
  universityDepartments$ = this.universityDepartments$$.asObservable();
  filters: LazyLoadEvent | null = null;

  totalRecords = 0;
  selectedUniversityDepartment: UniversityDepartment | null = null;
  selectedUniversities: UniversityDepartment[] = [];
  displayModal = false;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly universityDepartmentService: UniversityDepartmentApiService
  ) {}

  onNewClick() {
    this.displayModal = true;
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Jeni i sigurt që doni të fshini rajonet e zgjedhura?',
      accept: () => {
        //this.universityDepartmentStore.deleteSelectedUniversities();
        this.toastService.showWarning('Rajonet u fshin!');
      },
    });
  }

  onGridEvent(event: GridEvent<UniversityDepartment | UniversityDepartment[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedUniversities = [
          ...this.selectedUniversities,
          event.data as UniversityDepartment,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedUniversities = this.selectedUniversities.filter(r => {
          r.id !== (event.data as UniversityDepartment).id;
        });
        break;
      case GRID_ACTIONS.SELECT_MANY:
        this.selectedUniversities = [
          ...this.selectedUniversities,
          ...(event.data as UniversityDepartment[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedUniversities = [];
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedUniversityDepartment = Object.assign(
          {},
          event.data as UniversityDepartment
        );
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt që doni të fshini rajonin e zgjedhur?',
          accept: () => {
            this.deleteUniversityDepartment(event.data as UniversityDepartment);
          },
        });
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
  }

  onFormSave(universityDepartment: UniversityDepartment) {
    if (universityDepartment.id) {
      this.updateUniversityDepartment(universityDepartment);
    }
    if (!universityDepartment.id) {
      this.addUniversityDepartment(universityDepartment);
    }
  }

  getUniversities($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.universityDepartmentService
      .loadUniversities($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.universityDepartments$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  addUniversityDepartment(universityDepartment: UniversityDepartment) {
    this.universityDepartmentService
      .save(universityDepartment)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Rajoni u shtua me sukses!');
          this.displayModal = false;
          this.getUniversities(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi nje problem gjatë ndryshimit të rajonit!'
          );
      });
  }

  updateUniversityDepartment(universityDepartment: UniversityDepartment) {
    this.universityDepartmentService
      .update(universityDepartment)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Rajoni u ndryshua me sukses!');
          this.displayModal = false;
          this.getUniversities(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi nje problem gjatë ndryshimit të rajonit!'
          );
      });
  }

  deleteUniversityDepartment(universityDepartment: UniversityDepartment) {
    this.universityDepartmentService
      .delete(universityDepartment.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Rajoni u fshi me sukses!');
          this.getUniversities(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi nje problem gjatë fshirjes së rajonit!'
          );
      });
  }
}
