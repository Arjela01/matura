/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FailingStudentApiService } from '@msh/applications/data-access-applications';
import { FailingStudent } from '@msh/applications/domain-application';
import { AuthFacade } from '@msh/auth/data-access-auth';
import { Student } from '@msh/shared/domain-models';
import {
  GRID_ACTIONS,
  GlobalToastService,
  GridEvent,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { BehaviorSubject, combineLatest, map, tap } from 'rxjs';
import { ManageFailingStudentsFormComponent } from '../manage-failing-students-form/manage-failing-students-form.component';
import { ManageFailingStudentsGridComponent } from '../manage-failing-students-grid/manage-failing-students-grid.component';
import {TableLazyLoadEvent} from "primeng/table";

@UntilDestroy()
@Component({
  selector: 'manage-failing-students',
  standalone: true,
  templateUrl: './manage-failing-students.component.html',
  styleUrls: ['./manage-failing-students.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ToolbarModule,
    RippleModule,
    ManageFailingStudentsGridComponent,
    ManageFailingStudentsFormComponent,
  ],
})
export class ManageFailingStudentsComponent {
  private failingStudents$$ = new BehaviorSubject<FailingStudent[]>([]);
  failingStudents$ = this.failingStudents$$.asObservable();
  filters: TableLazyLoadEvent | null = null;

  totalRecords = 0;
  selectedFailingStudent: FailingStudent | null = null;
  student: Student | null = null;
  displayModal = false;
  isLoading = false;
  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    map(([_]) => {
      if (this.filters) {
        this.getFailingStudents(this.filters as TableLazyLoadEvent);
      }
    }),
    tap()
  );
  constructor(
    private readonly failingStudentService: FailingStudentApiService,
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private authFacade: AuthFacade
  ) {}

  onNewClick() {
    this.displayModal = true;
  }

  onGridEvent(event: GridEvent<FailingStudent | FailingStudent[]>) {
    switch (event.action) {
      case GRID_ACTIONS.EDIT:
        this.student = Object.assign({}, event.data as Student);
        this.selectedFailingStudent = Object.assign(
          {},
          event.data as FailingStudent
        );
        this.displayModal = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt qe doni të fshini studentin mbetës?',
          accept: () => {
            this.deleteFailingStudent(event.data as FailingStudent);
          },
        });
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
    this.selectedFailingStudent = null;
    this.student = null;
  }

  onFormSave(failingStudent: FailingStudent) {
    this.updateFailingStudent({
      ...failingStudent,
      studentId: this.student?.studentId,
    });
  }

  getFailingStudents($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.failingStudentService
      .loadFailingStudents($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.failingStudents$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  deleteFailingStudent(failingStudent: FailingStudent) {
    this.failingStudentService
      .delete(failingStudent.id!)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Studenti u fshi me sukses!');
          this.getFailingStudents(this.filters as TableLazyLoadEvent);
        }
        if (!response.isSuccessful)
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes së studentit mbetës!'
          );
      });
  }

  updateFailingStudent(failingStudent: FailingStudent) {
    this.isLoading = true;
    this.failingStudentService
      .update(failingStudent)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Studenti u ndryshua me sukses!');
          this.displayModal = false;
          this.getFailingStudents(this.filters as TableLazyLoadEvent);
          this.isLoading = false;
        }

        if (!response.isSuccessful)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të studentit mbetës!'
          );
        this.isLoading = false;
      });
  }
}
