import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService } from 'primeng/api';
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
import { AuthFacade, PermissionCheckService } from '@msh/auth/data-access-auth';
import { StudentsApiService } from '@msh/configurations/data-access-configurations';
import { AcademicYear, Student } from '@msh/shared/domain-models';
import { RippleModule } from 'primeng/ripple';
import { TableLazyLoadEvent } from 'primeng/table';
import { BehaviorSubject, combineLatest, map, skip, tap } from 'rxjs';
import { A1zGridComponent } from '../../a1z/a1z-grid/a1z-grid.component';
import { StudentsEditComponent } from '../students-edit/students-edit.component';
import { StudentsFormComponent } from '../students-form/students-form.component';
import { StudentsGridComponent } from '../students-grid/students-grid.component';
import { StudentDataComponent } from '../students-data/student-data.component';
import { PermissionEnum } from '@msh/auth/data-access-auth';

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
    StudentDataComponent,
    StudentsEditComponent,
    RippleModule,
    RouterLink,
    A1zGridComponent,
  ],
  templateUrl: './manage-students.component.html',
  styleUrls: ['./manage-students.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageStudentsComponent implements OnInit {
  private studentList$$ = new BehaviorSubject<Student[]>([]);
  studentList$ = this.studentList$$.asObservable();
  filters: TableLazyLoadEvent | null = null;

  hideStudentForm = true;
  totalRecords = 0;
  selectedStudent: Student | null = null;
  selectedStudentList: Student[] = [];
  academicYear?: Partial<AcademicYear> = undefined;

  studentId: string | undefined;
  selectedRecord: any;
  headerText: any;
  displayHistoryForm = false;
  showEditButton = false;
  showDeleteButton = false;
  showAddButton = false;

  constructor(
    private readonly studentService: StudentsApiService,
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private authFacade: AuthFacade,
    private readonly permissionCheckService: PermissionCheckService
  ) {}
  ngOnInit() {
    this.showEditButton = this.permissionCheckService.hasPermission(
      PermissionEnum.EditApplications as any
    );
    this.showDeleteButton = this.permissionCheckService.hasPermission(
      PermissionEnum.DeleteApplications as any
    );
    this.showAddButton = this.permissionCheckService.hasPermission(
      PermissionEnum.AddApplications as any
    );
  }

  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    skip(1),
    map(([academicYear]) => {
      if (this.filters) {
        this.getStudent(this.filters as TableLazyLoadEvent);
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

  onGridEvent(event: GridEvent<any | Student[]>) {
    switch (event.action) {
      case GRID_ACTIONS.HISTORY:
        this.selectedRecord = Object.assign({}, event.data);
        this.studentId = event.data.id;
        this.headerText = `Historiku për Maturantin {${event.data.studentId}}`;
        this.displayHistoryForm = true;
        break;
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedStudentList = [
          ...this.selectedStudentList,
          event.data as Student,
        ];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedStudentList = this.selectedStudentList.filter(u => {
          return u.studentId !== (event.data as Student).studentId;
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
          message: 'A jeni i sigurt që doni të fshini këtë maturant?',
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
          this.toastService.showSuccess('Maturanti u fshi me sukses!');
          this.getStudent(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);
        if (!response.isSuccessful) {
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes së maturantit!'
          );
        }
      });
  }

  getStudent($event: TableLazyLoadEvent): void {
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
          this.toastService.showSuccess('Maturanti u ndryshua me sukses!');
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së maturantit!'
          );
      });
  }

  protected readonly PermissionEnum = PermissionEnum;
}
