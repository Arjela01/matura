import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { FailingStudentApiService } from '@msh/applications/data-access-applications';
import { FailingStudent } from '@msh/applications/domain-application';

import { AuthFacade } from '@msh/auth/data-access-auth';
import {
  GRID_ACTIONS,
  GlobalToastService,
  GridEvent,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { BehaviorSubject, combineLatest, map, tap } from 'rxjs';
import { FailingStudentsFormComponent } from '../failing-students-form/failing-students-form.component';
import { FailingStudentsGridComponent } from '../failing-students-grid/failing-students-grid.component';
import { StudentsApiService } from '@msh/configurations/data-access-configurations';
import { TableLazyLoadEvent } from 'primeng/table';

@UntilDestroy()
@Component({
  selector: 'msh-manage-failing-students',
  standalone: true,
  templateUrl: './manage-failing-students.component.html',
  styleUrls: ['./manage-failing-students.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    FailingStudentsFormComponent,
    FailingStudentsGridComponent,
    ToolbarModule,
    RippleModule,
  ],
  providers: [ConfirmationService],
})
export class ManageFailingStudentsComponent {
  private failingStudents$$ = new BehaviorSubject<FailingStudent[]>([]);
  failingStudents$ = this.failingStudents$$.asObservable();
  filters: TableLazyLoadEvent | null = null;
  hasAdditionalValue: any;

  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    map(([_]) => {
      if (this.filters) {
        this.getStudents(this.filters as TableLazyLoadEvent);
      }
    }),
    tap()
  );
  totalRecords = 0;
  selectedFailingStudent: FailingStudent | null = null;
  displayModal = false;

  constructor(
    private readonly failingStudentService: FailingStudentApiService,
    private readonly studentService: StudentsApiService,
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private authFacade: AuthFacade,
    private readonly cd: ChangeDetectorRef
  ) {}

  onNewClick() {
    this.displayModal = true;
  }

  onGridEvent(event: GridEvent<FailingStudent | FailingStudent[]>) {
    switch (event.action) {
      case GRID_ACTIONS.EDIT:
        this.selectedFailingStudent = Object.assign(
          {},
          event.data as FailingStudent
        );
        this.displayModal = true;
    }
  }

  onModalClose() {
    this.displayModal = false;
    this.selectedFailingStudent = null;
  }

  onFormSave(failingStudent: FailingStudent) {
    this.saveFailingStudent({
      ...failingStudent,
      studentId: failingStudent.id,
    });
  }
  getStudents($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);
    const params = {
      isFall: false,
    };

    this.studentService
      .loadStudents($event, params)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        const studentsWithAdditionalValueZero = response.data.filter(
          student => !student.isFall
        );
        this.failingStudents$$.next(studentsWithAdditionalValueZero);
        this.totalRecords = response.total;
        this.cd.markForCheck();
      });
  }

  saveFailingStudent(failingStudent: FailingStudent) {
    this.failingStudentService
      .save(failingStudent)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Studenti u ndryshua me sukses!');
          this.displayModal = false;
          this.getStudents(this.filters as TableLazyLoadEvent);
          console.log(123, failingStudent);
        } else this.toastService.showError(response.errorMessage);

        if (!response.isSuccessful)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të studentit mbetës!'
          );
      });
  }
}
