import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';

import {
  GRID_ACTIONS,
  GlobalToastService,
  GridEvent,
} from '@msh/shared/util-shared';

import { RouterLink } from '@angular/router';
import { AuthFacade } from '@msh/auth/data-access-auth';
import { StudentsApiService } from '@msh/configurations/data-access-configurations';
import { AcademicYear, Student } from '@msh/shared/domain-models';
import { RippleModule } from 'primeng/ripple';
import { BehaviorSubject, combineLatest, map, tap } from 'rxjs';
import { StudentsEditComponent } from '../students-edit/students-edit.component';
import { StudentsFormComponent } from '../students-form/students-form.component';
import { StudentsGridComponent } from '../students-grid/students-grid.component';
import { StudentViewComponent } from '../students-view/student-view.component';
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
    StudentViewComponent,
    StudentsEditComponent,
    RippleModule,
    RouterLink,
  ],
  templateUrl: './manage-students.component.html',
  styleUrls: ['./manage-students.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageStudentsComponent {
  private studentList$$ = new BehaviorSubject<Student[]>([]);
  studentList$ = this.studentList$$.asObservable();
  filters: LazyLoadEvent | null = null;

  hideStudentForm = true;
  totalRecords = 0;
  selectedStudent: Student | null = null;
  selectedStudentList: Student[] = [];
  academicYear?: Partial<AcademicYear> = undefined;

  constructor(
    private readonly studentService: StudentsApiService,
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private authFacade: AuthFacade
  ) {}

  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    map(([academicYear]) => {
      if (this.filters) {
        this.getStudent(this.filters as LazyLoadEvent);
        this.academicYear = academicYear;
      }
    }),
    tap()
  );

  onNewClick() {
    this.hideStudentForm = !this.hideStudentForm;
    this.selectedStudent = {
      isFall: this.academicYear?.isFall,
    } as Student;
  }

  onGridEvent(event: GridEvent<Student | Student[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        // eslint-disable-next-line max-len
        this.selectedStudentList = [
          ...this.selectedStudentList,
          event.data as Student,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedStudentList = this.selectedStudentList.filter(u => {
          u.studentId !== (event.data as Student).studentId;
        });
        break;
      case GRID_ACTIONS.SELECT_MANY:
        this.selectedStudentList = [
          ...this.selectedStudentList,
          ...(event.data as Student[]),
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedStudentList = [];
        break;
      case GRID_ACTIONS.EDIT:
        // eslint-disable-next-line max-len
        // TODO: Route to a1z-form with id as a query parameter to get the dertails
        this.selectedStudent = Object.assign({}, event.data as Student);
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'A jeni i sigurt që doni të fshini këtë student?',
          accept: () => {
            this.deleteStudent(event.data as Student);
          },
        });
        break;
    }
  }

  deleteStudent(Student: Student) {
    this.studentService
      .delete(Student.id.toString())
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Studenti u fshi me sukses!');
          this.getStudent(this.filters as LazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);
        if (!response.isSuccessful) {
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes së studentit!'
          );
        }
      });
  }

  getStudent($event: LazyLoadEvent): void {
    this.filters = Object.assign({}, $event);

    this.studentService
      .loadStudents($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        const students = [...response.data];
        for (const student of students) {
          student.createdOn = new Date(student.createdOn);
          if (student.modifiedOn != null)
            student.modifiedOn = new Date(student.modifiedOn);
        }
        this.studentList$$.next(students);
        this.totalRecords = response.total;
      });
  }
  updateStudent(student: Student) {
    this.studentService
      .update(student)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Studenti u ndryshua me sukses!');
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së studentit!'
          );
      });
  }
}
