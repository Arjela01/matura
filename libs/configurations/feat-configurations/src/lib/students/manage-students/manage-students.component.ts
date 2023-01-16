import { CommonModule } from '@angular/common';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';

import {
  HighSchoolApiService, ProfileApiService,
} from '@msh/configurations/data-access-configurations';
import { Student} from '@msh/configurations/domain-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';

import {
  GlobalToastService,
  GridEvent,
  GRID_ACTIONS,
} from '@msh/shared/util-shared';

import { BehaviorSubject } from 'rxjs';
import {StudentsFormComponent} from "../students-form/students-form.component";
import {StudentsGridComponent} from "../students-grid/students-grid.component";
import {StudentsApiService} from "../../../../../data-access-configurations/src/lib/students/students-api.service";
@UntilDestroy()
@Component({
  selector: 'msh-manage-students',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    StudentsFormComponent,
    StudentsGridComponent,
    ToolbarModule,
  ],
  templateUrl: './manage-students.component.html',
  styleUrls: ['./manage-students.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],

})
export class ManageStudentsComponent implements OnInit {
  private students$$ = new BehaviorSubject<Student[]>([]);
  students$ = this.students$$.asObservable();
  filters: LazyLoadEvent | null = null;

  totalRecords = 0;
  selectedStudent: Student | null = null;
  selectedStudents: Student[] = [];
  displayModal = false;
  schoolProfile: DropdownModel<number>[] = [];

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly studentService: StudentsApiService,
    private readonly highSchoolService: HighSchoolApiService,
    private readonly profileService: ProfileApiService,

    private readonly cd: ChangeDetectorRef,

  ) {}



  ngOnInit(): void {
    this.getProfileSchoolDropdown();

  }

  onNewClick() {
    this.displayModal = true;
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Jeni i sigurt që doni të fshini maturantet?',
      accept: () => {
        this.toastService.showWarning('Maturantet e zgjedhur u fshinë!');
      },
    });
  }

  onGridEvent(event: GridEvent<Student | Student[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedStudents = [
          ...this.selectedStudents,
          event.data as Student,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedStudents = this.selectedStudents.filter(hs => {
          hs.id !== (event.data as Student).id;
        });
        break;

      case GRID_ACTIONS.SELECT_MANY:
        this.selectedStudents = [
          ...this.selectedStudents,
          ...(event.data as Student[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedStudents = [];
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedStudent = Object.assign({}, event.data as Student);
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt që doni të fshini maturantin?',
          accept: () => {
            this.deleteStudent(event.data as Student);
          },
        });
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
  }

  onFormSave(student: Student) {
    if (student.id) {
      this.updateStudent(student);
    }
    if (!student.id) {
      this.addStudent(student);
    }
  }

  getStudents($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.studentService
      .loadStudents($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.students$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  addStudent(student: Student) {
    this.studentService
      .save(student)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Maturanti u shtua me sukses!');
          this.displayModal = false;
          this.getStudents(this.filters as LazyLoadEvent);
          this.cd.detectChanges();

        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së maturantit!'
          );
      });
  }

  updateStudent(student: Student) {
    this.studentService
      .update(student)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            'Maturanti u ndryshua me sukses!'
          );
          this.displayModal = false;
          this.getStudents(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së maturantit!'
          );
      });
  }

  deleteStudent(student: Student) {
    this.studentService
      .delete(student.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showInfo('Maturanti u fshi me sukses!');
          this.getStudents(this.filters as LazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes së shkollës së mesme!'
          );
      });
  }



  getProfileSchoolDropdown() {
    this.profileService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.schoolProfile = response.data;
      });
  }
}

