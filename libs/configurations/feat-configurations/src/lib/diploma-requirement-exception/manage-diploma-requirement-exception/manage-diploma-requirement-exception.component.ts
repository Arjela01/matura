import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StudentsApiService } from '@msh/configurations/data-access-configurations';
import { Student } from '@msh/shared/domain-models';

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
import { ToolbarModule } from 'primeng/toolbar';
import { BehaviorSubject } from 'rxjs';
import { RippleModule } from 'primeng/ripple';
import { DiplomaRequirementExceptionGridComponent } from '../diploma-requirement-exception-grid/diploma-requirement-exception-grid.component';
import {FileUploadModule} from "primeng/fileupload";

@UntilDestroy()
@Component({
  selector: 'msh-manage-diploma-requirement-exception',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ToolbarModule,
    RippleModule,
    DiplomaRequirementExceptionGridComponent,
    FileUploadModule,

  ],
  templateUrl: './manage-diploma-requirement-exception.component.html',
  styleUrls: ['./manage-diploma-requirement-exception.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageDiplomaRequirementExceptionComponent {
  private studentList$$ = new BehaviorSubject<Student[]>([]);
  studentList$ = this.studentList$$.asObservable();
  filters: LazyLoadEvent | null = null;

  totalRecords = 0;
  selectedStudent: Student | null = null;
  selectedStudentList: Student[] = [];
  displayUploadModal = false;
  displayModal = false;
  base64: string | ArrayBuffer | null | undefined;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly studentService: StudentsApiService
  ) {}

  onUploadClick() {
    this.displayUploadModal = true;
  }

  onUploadClose() {
    this.displayUploadModal = false;
  }

  getStudent($event: LazyLoadEvent): void {
    this.filters = Object.assign({}, $event);

    this.studentService
      .loadStudents($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.studentList$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  onGridEvent(event: GridEvent<Student | Student[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedStudentList = [
          ...this.selectedStudentList,
          event.data as Student,
        ];
        break;
      case GRID_ACTIONS.CUSTOM_ACTION2:
        this.confirmationService.confirm({
          message:
            'Jeni i sigurt që doni të ndryshoni statusin e diplomës së studentit?',
          accept: () => {
            this.changeStatus(event.data as Student);
          },
        });
        break;
    }
  }

  changeStatus(student: Student) {
    this.studentService
      .confirmException({
        id: student.id,
        isConfirmed: !student?.isConfirmedBySupervisor,
      })
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
          'Ndryshimet u ruajten me sukses')
          this.displayModal = false;
          this.getStudent(this.filters as LazyLoadEvent);
        } else this.toastService.showError(response.errorMessage)
        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së statusit të diplomës!'
          );
      });
  }

  onUpload(event: any) {
    const file = event.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      this.base64 = base64.split(',')[1];
      this.studentService.uploadExcelFile(this.base64).subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Dokumenti u shtua me sukses!');
          this.getStudent(this.filters as LazyLoadEvent);
        } else this.toastService.showError(response.errorMessage)
        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ngarkimit të dokumentit!'
          );
      });
    };
  }
}
