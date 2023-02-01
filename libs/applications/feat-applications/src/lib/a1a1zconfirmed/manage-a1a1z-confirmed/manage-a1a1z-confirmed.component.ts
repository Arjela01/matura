import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConfirmedA1A1ZService } from '@msh/applications/data-access-applications';
import { StudentsApiService } from '@msh/configurations/data-access-configurations';
import { Student } from '@msh/configurations/domain-configurations';
import {
  GlobalToastService,
  GridEvent,
  GRID_ACTIONS,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { BehaviorSubject } from 'rxjs';
import { A1a1zGridComponent } from '../a1a1z-grid/a1a1z-grid.component';

@Component({
  selector: 'manage-a1a1z-confirmed',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ToolbarModule,
    A1a1zGridComponent,
    RippleModule,
    RouterLink,
  ],
  templateUrl: './manage-a1a1z-confirmed.component.html',
  styleUrls: ['./manage-a1a1z-confirmed.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
@UntilDestroy()
export class ManageA1a1zConfirmedComponent {
  private studentList$$ = new BehaviorSubject<Student[]>([]);
  studentList$ = this.studentList$$.asObservable();
  filters: LazyLoadEvent | null = null;
  totalRecords = 0;

  constructor(
    private readonly studentService: StudentsApiService,
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private a1a1zService: ConfirmedA1A1ZService
  ) {}

  ngOnInit(): void {}

  onGridEvent(event: GridEvent<Student | Student[]>) {
    switch (event.action) {
      case GRID_ACTIONS.REJECT:
        this.confirmationService.confirm({
          message: 'Jeni i sigurtë që doni të refuzoni formularin?',
          accept: () => {
            this.refuseA1A1Z(event.data as Student);
          },
        });
        break;
      case GRID_ACTIONS.ACCEPT:
        this.confirmationService.confirm({
          message: 'Jeni i sigurtë që doni të aprovoni formularin?',
          accept: () => {
            this.approveA1A1Z(event.data as Student);
          },
        });
        break;
    }
  }

  refuseA1A1Z(Student: Student) {
    this.a1a1zService
      .refuseA1A1Z(Student.id.toString())
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Formulari u refuzua me sukses!');
          this.getStudent(this.filters as LazyLoadEvent);
        }
        if (!response.isSuccessful) {
          this.toastService.showError('Ndodhi një problem!');
        }
      });
  }
  approveA1A1Z(Student: Student) {
    this.a1a1zService
      .approveA1A1Z(Student.id.toString())
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Formulari u aprovua me sukses!');
          this.getStudent(this.filters as LazyLoadEvent);
        }
        if (!response.isSuccessful) {
          this.toastService.showError('Ndodhi një problem!');
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
}
