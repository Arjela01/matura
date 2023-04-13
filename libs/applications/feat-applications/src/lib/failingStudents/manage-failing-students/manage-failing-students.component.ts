import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FailingStudentApiService } from '@msh/applications/data-access-applications';
import { FailingStudent } from '@msh/applications/domain-application';

import {
  GRID_ACTIONS,
  GlobalToastService,
  GridEvent,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { BehaviorSubject } from 'rxjs';
import { FailingStudentsFormComponent } from '../failing-students-form/failing-students-form.component';
import { FailingStudentsGridComponent } from '../failing-students-grid/failing-students-grid.component';

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
  filters: LazyLoadEvent | null = null;

  totalRecords = 0;
  selectedFailingStudent: FailingStudent | null = null;
  displayModal = false;

  constructor(
    private readonly failingStudentService: FailingStudentApiService,
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService
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
      id: failingStudent.id,
    });
  }

  getStudents($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.failingStudentService
      .loadFailingStudents($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.failingStudents$$.next(response.data);
        this.totalRecords = response.total;
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
          this.getStudents(this.filters as LazyLoadEvent);
        }

        if (!response.isSuccessful)
          this.toastService.showError(
            'Ndodhi nje problem gjatë ndryshimit të studentit mbetes!'
          );
      });
  }
}
