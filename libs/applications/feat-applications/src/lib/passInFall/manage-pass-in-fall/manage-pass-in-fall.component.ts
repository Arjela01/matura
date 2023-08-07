/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { FailingStudentApiService } from '@msh/applications/data-access-applications';
import { FailingStudent } from '@msh/applications/domain-application';
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
import { BehaviorSubject } from 'rxjs';
import { PassInFallGridComponent } from '../pass-in-fall-grid/pass-in-fall-grid.component';
import { TableLazyLoadEvent } from 'primeng/table';

@UntilDestroy()
@Component({
  selector: 'msh-manage-pass-in-fall',
  standalone: true,
  templateUrl: './manage-pass-in-fall.component.html',
  styleUrls: ['./manage-pass-in-fall.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ToolbarModule,
    RippleModule,
    PassInFallGridComponent,
  ],
})
export class ManagePassInFallComponent {
  private failingStudents$$ = new BehaviorSubject<FailingStudent[]>([]);
  failingStudents$ = this.failingStudents$$.asObservable();
  filters: TableLazyLoadEvent | null = null;

  totalRecords = 0;
  selectedFailingStudent: FailingStudent | null = null;

  constructor(
    private cd: ChangeDetectorRef,
    private readonly failingStudentService: FailingStudentApiService,
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService
  ) {}

  onGridEvent(event: GridEvent<FailingStudent | FailingStudent[]>) {
    switch (event.action) {
      case GRID_ACTIONS.EDIT:
        console.log(event.data);
        this.confirmationService.confirm({
          message: 'A jeni i sigurt që ka kaluar në vjeshtë maturanti?',
          accept: () => {
            this.updateFailingStudent(event.data as FailingStudent);
            event.data as FailingStudent;
          },
        });
        break;
    }
  }

  onFormSave(failingStudent: FailingStudent) {
    this.updateFailingStudent(failingStudent);
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

  updateFailingStudent(failingStudent: FailingStudent) {
    this.failingStudentService
      .getOne(failingStudent.id!)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful === true) {
          this.failingStudentService
            .update({
              studentId: failingStudent.studentId,
              subject: failingStudent.subjectName,
              id: response.data.id,
              willRetryInFall: true,
            })
            .pipe(untilDestroyed(this))
            .subscribe(response => {
              if (response.isSuccessful === true) {
                this.toastService.showSuccess('Studenti u ndryshua me sukses!');
                this.getFailingStudents(this.filters as TableLazyLoadEvent);
              }

              if (response.isSuccessful === false)
                this.toastService.showError(
                  'Ndodhi një problem gjatë ndryshimit të studentit mbetës!'
                );
            });
          this.cd.detectChanges();
        }

        if (response.isSuccessful === false) {
          this.toastService.showError(
            'Ndodhi një problem gjatë kerkimit të studentit mbetës!'
          );
        }
      });
  }
}
