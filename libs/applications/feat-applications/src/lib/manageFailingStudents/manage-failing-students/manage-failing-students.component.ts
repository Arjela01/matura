/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
import { ManageFailingStudentsFormComponent } from '../manage-failing-students-form/manage-failing-students-form.component';
import { ManageFailingStudentsGridComponent } from '../manage-failing-students-grid/manage-failing-students-grid.component';

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
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt qe deshironi te fshini studentin mbetes?',
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
  }

  onFormSave(id: FailingStudent) {
    this.updateFailingStudent(id);
  }

  getFailingStudents($event: LazyLoadEvent) {
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
          this.getFailingStudents(this.filters as LazyLoadEvent);
        }
        if (!response.isSuccessful)
          this.toastService.showError(
            'Ndodhi nje problem gjatë fshirjes së studentit mbetes!'
          );
      });
  }

  updateFailingStudent(failingStudent: FailingStudent) {
    // eslint-disable-next-line no-debugger
    debugger;
    this.failingStudentService
      .update(failingStudent)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Studenti u ndryshua me sukses!');
          this.displayModal = false;
          this.getFailingStudents(this.filters as LazyLoadEvent);
        }

        if (!response.isSuccessful)
          this.toastService.showError(
            'Ndodhi nje problem gjatë ndryshimit të studentit mbetes!'
          );
      });
  }
}
