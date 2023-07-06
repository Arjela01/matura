import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthFacade } from '@msh/auth/data-access-auth';
import {
  AdministrationOfficeApiService,
  DiplomasStudentApiService,
  HighSchoolApiService,
  StudentsApiService,
} from '@msh/configurations/data-access-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { Status, Student, StudentType } from '@msh/shared/domain-models';
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
import { BehaviorSubject, Observable, combineLatest, map, tap } from 'rxjs';
import { DiplomasStudentFormComponent } from '../diplomas-student-form/diplomas-student-form.component';
import { DiplomasStudentGridComponent } from '../diplomas-student-grid/diplomas-student-grid.component';
let INITIAL_FILTER = {};
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
  @Input() printed = false;
  @Input() title = 'Diplomat aktive';
  private studentList$$ = new BehaviorSubject<Student[]>([]);
  studentList$ = this.studentList$$.asObservable();
  filters: LazyLoadEvent | null = null;
  displayModal = false;
  hideStudentForm = true;
  totalRecords = 0;
  selectedStudent: Student | null = null;
  selectedStudentList: Student[] = [];

  studentTypes: DropdownModel<number>[] = [
    {
      key: StudentType.CurrentStudent,
      value: 'Maturant i sivjetshëm',
      parentKey: null,
    },
    {
      key: StudentType.PreviousStudent,
      value: 'Maturant i kaluar',
      parentKey: null,
    },

  ];
  administrationOffices: DropdownModel<number>[] = [];
  highSchools$$: BehaviorSubject<DropdownModel<number>[]> = new BehaviorSubject<
    DropdownModel<number>[]
  >([]);
  highSchools$ = this.highSchools$$.asObservable() as Observable<
    DropdownModel<number>[]
  >;

  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    map(([_]) => {
      if (this.filters) {
        this.getStudentDiplomas(this.filters as LazyLoadEvent);
      }
    }),
    tap()
  );
  constructor(
    private readonly studentService: StudentsApiService,
    private readonly toastService: GlobalToastService,
    private diplomasService: DiplomasStudentApiService,
    private administrationOfficeApiService: AdministrationOfficeApiService,
    private highschoolApiService: HighSchoolApiService,
    private authFacade: AuthFacade
  ) {}

  ngOnInit(): void {
    this.getAdministrationOfficeDropdown();
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
      .subscribe(response => {
        this.administrationOffices = response.data;
      });
  }
  getHighSchoolsDropdown() {
    this.highschoolApiService
      .loadDropDownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.highSchools$$.next(response.data);
      });
  }

  onGridEvent(event: GridEvent<Student>) {
    switch (event.action) {
      case GRID_ACTIONS.PRINT:
        this.printDiploma(event);
        break;
    }
  }

  onAdmOfficeChange(id: string) {
    this.getHighSchoolsByOffice(id);
  }

  printDiploma(event: GridEvent<Student>) {
    this.diplomasService
      .exportDiplomasStudent(event.data?.studentId as string, !this.printed)
      .subscribe(
        response => {
          const blob = new Blob([response], {
            type: 'application/pdf',
          });
          FileSaver.saveAs(blob, `Diploma_${event.data?.fullName}`);
          this.getStudentDiplomas(this.filters as LazyLoadEvent);
        },
        err => {
          this.toastService.showError(err.error);
        }
      );
  }

  onFormSave(data: string) {
    this.printAllDiplomas(data);
  }

  printAllDiplomas(data: string) {
    this.diplomasService.exportAllDiplomas(data).subscribe(
      response => {
        const blob = new Blob([response], {
          type: 'application/pdf',
        });
        FileSaver.saveAs(blob, `Diplomat`);
        this.displayModal = false;
        this.getStudentDiplomas(this.filters as LazyLoadEvent);
      },
      err => {
        this.toastService.showError(err.error);
      }
    );
  }

  getHighSchoolsByOffice(administrationOfficeId: string): void {
    this.highschoolApiService
      .forAdministrationOffice(administrationOfficeId)
      .subscribe(response => {
        this.highSchools$$.next(response.data as any);
      });
  }

  getStudentDiplomas($event: LazyLoadEvent): void {
    INITIAL_FILTER = {
      isPrinted: [
        {
          value: Status.NOTPRINTED,
          matchMode: 'equals',
          operator: 'and',
        },
      ],
    };
    if (this.printed) {
      $event.filters = {
        ...$event.filters,
        ...INITIAL_FILTER,
      };
    }
    this.filters = $event;
    this.diplomasService
      .loadStudentDiplomas($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        console.log(response);
        const students = [...response.data];
        for (const student of students) {
          if (student.printedDate === '0001-01-01T00:00:00') {
            student.printedDate = null;
          } else {
            student.printedDate = new Date(student.printedDate);
          }
        }
        this.studentList$$.next(students);
        this.totalRecords = response.total;
      });
  }
}
