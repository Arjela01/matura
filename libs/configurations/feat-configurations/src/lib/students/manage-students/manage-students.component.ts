import { CommonModule } from '@angular/common';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';

import {
  A1ZApiService,
  GendersApiService,
  HighSchoolApiService, ProfileApiService,
} from '@msh/configurations/data-access-configurations';
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
import {Student} from "../../../../../domain-configurations/src/students/students.model";
import {A1Z} from "@msh/configurations/domain-configurations";
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
  private studentList$$ = new BehaviorSubject<Student[]>([]);
  studentList$ = this.studentList$$.asObservable();
  filters: LazyLoadEvent | null = null;

  hideStudentForm = true;
  totalRecords = 0;
  selectedStudent: Student | null = null;
  selectedStudentList: Student[] = [];

  constructor(
    private readonly studentService: StudentsApiService,
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService
  ) {}

  ngOnInit(): void {
    console.log('init');
  }

  onNewClick() {
    this.hideStudentForm = !this.hideStudentForm;
  }
  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete selected entities?',
      accept: () => {
        this.toastService.showWarning('Student deleted!');
      },
    });
  }


  onGridEvent(event: GridEvent<Student | Student[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        // eslint-disable-next-line max-len
        this.selectedStudentList = [...this.selectedStudentList, event.data as Student];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedStudentList = this.selectedStudentList.filter(u => {
          u.id !== (event.data as Student).id;
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
          message: 'Are you sure that you want to delete this entity?',
          accept: () => {
            this.deleteA1Z(event.data as Student);
          },
        });
        break;
    }
  }

  deleteA1Z(Student: Student) {
    this.studentService
      .delete(Student.id.toString())
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Student u fshi me sukses!');
        }
        if (!response.isSuccessful) {
          this.toastService.showError(
            'Ndonje nje problem gjate fshirjes se Studentit!'
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
        console.log(response);
        this.studentList$$.next(response.data);
        this.totalRecords = response.total;
      });
  }
}
