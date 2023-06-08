import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  AdministrationOfficeApiService,
  DiplomasStudentApiService,
  HighSchoolApiService,
  StudentsApiService,
} from '@msh/configurations/data-access-configurations';
import { Student, StudentVersion } from '@msh/shared/domain-models';
import {
  GRID_ACTIONS,
  GlobalToastService,
  GridEvent,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as FileSaver from 'file-saver';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { BehaviorSubject } from 'rxjs';
import { DiplomasStudentFormComponent } from '../diplomas-student-form/diplomas-student-form.component';
import { DiplomasStudentGridComponent } from '../diplomas-student-grid/diplomas-student-grid.component';

@Component({
  selector: 'msh-manage-diplomas-student',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ToolbarModule,
    DiplomasStudentFormComponent,
    DiplomasStudentGridComponent,
    RippleModule,
    RouterLink,
  ],
  templateUrl: './manage-diplomas-student.component.html',
  styleUrls: ['./manage-diplomas-student.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
@UntilDestroy()
export class ManageDiplomasStudentComponent {
  private studentList$$ = new BehaviorSubject<Student[]>([]);
  studentList$ = this.studentList$$.asObservable();
  filters: LazyLoadEvent | null = null;
  displayModal = false;
  hideStudentForm = true;
  totalRecords = 0;
  selectedStudent: Student | null = null;
  selectedStudentList: Student[] = [];

  studentVersion: any[] = [
    {
      key: StudentVersion.CurrentStudent,
      value: 'Student aktiv',
      parentKey: null,
    },
    {
      key: StudentVersion.PreviousStudent,
      value: 'Student mbetës',
      parentKey: null,
    },
  ];
  administrationOffices: any[] = [];
  highSchools: any[] = [];

  constructor(
    private readonly studentService: StudentsApiService,
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private diplomasService: DiplomasStudentApiService,
    private administrationOfficeApiService: AdministrationOfficeApiService,
    private highschoolApiService: HighSchoolApiService
  ) {}

  ngOnInit(): void {
    this.getAdministrationOfficeDropdown();
    this.getHighSchoolsDropdown();
  }

  onNewClick() {
    this.displayModal = true;
  }
  onModalClose() {
    this.displayModal = false;
  }

  getAdministrationOfficeDropdown() {
    this.administrationOfficeApiService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        this.administrationOffices = response.data;
      });
  }
  getHighSchoolsDropdown() {
    this.highschoolApiService
      .loadDropDownList()
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        this.highSchools = response.data;
      });
  }

  onGridEvent(event: GridEvent<Student>) {
    switch (event.action) {
      case GRID_ACTIONS.PRINT:
        this.printDiplomas(event);
        break;
    }
  }
  printDiplomas(event: GridEvent<Student>) {
    console.log(event.data);
    this.diplomasService
      .exportDiplomasStudent(event.data?.studentId as string)
      .subscribe((response: any) => {
        const blob: any = new Blob([response], {
          type: 'application/pdf',
        });
        FileSaver.saveAs(
          blob,
          `Diploma_${event.data?.firstName}_${event.data?.lastName}`
        );
      });
  }

  onFormSave(data: string) {
    this.printAllDiplomas(data);
  }

  printAllDiplomas(data: string) {
    this.diplomasService.exportAllDiplomas(data).subscribe((response: any) => {
      const blob: any = new Blob([response], {
        type: 'application/pdf',
      });
      FileSaver.saveAs(blob, `Diplomat`);
    });
  }

  deleteStudent(Student: Student) {
    this.studentService
      .delete(Student.id.toString())
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Studenti u fshi me sukses!');
          this.getStudent(this.filters as LazyLoadEvent);
        }
        if (!response.isSuccessful) {
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes së studentit!'
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
          this.toastService.showSuccess('Studenti u ndryshua me sukses!');
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së studentit!'
          );
      });
  }
}
