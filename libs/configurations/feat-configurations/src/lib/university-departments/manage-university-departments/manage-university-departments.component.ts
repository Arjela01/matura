import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';

import { UniversityDepartment } from '@msh/shared/domain-models';

import {
  GlobalToastService,
  GridEvent,
  GRID_ACTIONS,
} from '@msh/shared/util-shared';

import { BehaviorSubject } from 'rxjs';
import { RippleModule } from 'primeng/ripple';
import { UniversityDepartmentGridComponent } from '../university-department-grid/university-department-grid.component';
import { UniversityDepartmentFormComponent } from '../university-department-form/university-department-form.component';
import {
  UniversityApiService,
  UniversityDepartmentApiService,
} from '@msh/configurations/data-access-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { TableLazyLoadEvent } from 'primeng/table';

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
  templateUrl: './manage-university-departments.component.html',
  styleUrls: ['./manage-university-departments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageUniversityDepartmentsComponent implements OnInit {
  private universityDepartments$$ = new BehaviorSubject<UniversityDepartment[]>(
    []
  );
  universityDepartments$ = this.universityDepartments$$.asObservable();
  filters: TableLazyLoadEvent | null = null;

  totalRecords = 0;
  selectedUniversityDepartment: UniversityDepartment | null = null;
  selectedUniversityDepartments: UniversityDepartment[] = [];
  displayModal = false;
  universities: DropdownModel<number>[] = [];

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly universityDepartmentService: UniversityDepartmentApiService,
    private readonly universityService: UniversityApiService
  ) {}

  ngOnInit(): void {
    this.getUniversityDropdown();
  }

  onNewClick() {
    this.displayModal = true;
    this.selectedUniversityDepartment = {} as UniversityDepartment;
  }

  onGridEvent(event: GridEvent<UniversityDepartment | UniversityDepartment[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedUniversityDepartments = [
          ...this.selectedUniversityDepartments,
          event.data as UniversityDepartment,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedUniversityDepartments =
          this.selectedUniversityDepartments.filter(r => {
            r.id !== (event.data as UniversityDepartment).id;
          });
        break;
      case GRID_ACTIONS.SELECT_MANY:
        this.selectedUniversityDepartments = [
          ...this.selectedUniversityDepartments,
          ...(event.data as UniversityDepartment[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedUniversityDepartments = [];
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
          message: 'Jeni i sigurt që doni të fshini fakultetin e zgjedhur?',
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

  getUniversityDepartments($event: TableLazyLoadEvent) {
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
          this.toastService.showSuccess('Fakulteti u shtua me sukses!');
          this.displayModal = false;
          this.getUniversityDepartments(this.filters as TableLazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të fakultetit!'
          );
      });
  }

  updateUniversityDepartment(universityDepartment: UniversityDepartment) {
    this.universityDepartmentService
      .update(universityDepartment)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Fakulteti u ndryshua me sukses!');
          this.displayModal = false;
          this.getUniversityDepartments(this.filters as TableLazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë departamentit të fakultetit!'
          );
      });
  }

  deleteUniversityDepartment(universityDepartment: UniversityDepartment) {
    this.universityDepartmentService
      .delete(universityDepartment.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Fakulteti u fshi me sukses!');
          this.getUniversityDepartments(this.filters as TableLazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes së fakultetit!'
          );
      });
  }

  getUniversityDropdown() {
    this.universityService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.universities = response.data;
      });
  }
}
