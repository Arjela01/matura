import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import {
  GlobalToastService,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { BehaviorSubject } from 'rxjs';
import { RouterLink } from '@angular/router';
import { Student } from '@msh/shared/domain-models';
import { TableLazyLoadEvent } from 'primeng/table';
import { StudentsAuditService } from '@msh/audit-logs/data-access-audit-log';
import { StudentAuditGridComponent } from '../student-audit-grid/student-audit-grid.component';
import { StudentAuditFormComponent } from '../student-audit-edit/student-audit-form.component';

@UntilDestroy()
@Component({
  selector: 'msh-manage-student-audit',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ToolbarModule,
    RouterLink,
    StudentAuditGridComponent,
    StudentAuditFormComponent,
  ],
  templateUrl: './manage-student-audit.component.html',
  styleUrls: ['./manage-student-audit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageStudentAuditComponent {
  private studentAuditList$$ = new BehaviorSubject<Student[]>([]);
  studentAuditList$ = this.studentAuditList$$.asObservable();
  filters: TableLazyLoadEvent | null = null;
  selectedStudent: Student | null = null;
  totalRecords = 0;
  displayModal = false;

  constructor(
    private readonly toastService: GlobalToastService,
    private readonly studentAuditService: StudentsAuditService
  ) {}

  onNewClick() {
    this.displayModal = true;
  }

  onGridEvent(event: GridEvent<Student | Student[]>) {
    switch (event.action) {
      case GRID_ACTIONS.EDIT:
        this.selectedStudent = Object.assign({}, event.data as Student);
        this.displayModal = true;
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
  }

  getStudents($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.studentAuditService
      .loadStudents($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.studentAuditList$$.next(response.data);
        this.totalRecords = response.total;
      });
  }
  updateStudentData(student: Student) {
    this.studentAuditService
      .updateStudent(student)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Maturanti u ndryshua me sukses!');
          this.displayModal = false;
          this.getStudents(this.filters as TableLazyLoadEvent);
        } else this.toastService.showError(response.errorMessage);

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së maturantit!'
          );
      });
  }
}
