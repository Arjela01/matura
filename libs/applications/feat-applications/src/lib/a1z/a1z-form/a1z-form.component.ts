import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { A1ZApiService } from '@msh/applications/data-access-applications';
import { A1Z, CarriedGrade } from '@msh/applications/domain-application';
import {
  A1ZCategoryApiService,
  AcademicYearApiService,
  CarriedGradeApiService,
  ExamSubjectApiService,
  ExamTypeApiService,
  ReportsApiService,
  StudentsApiService,
} from '@msh/configurations/data-access-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import {
  AcademicYear,
  EXAM_TYPES,
  Report,
  Student,
} from '@msh/shared/domain-models';
import {
  SharedStudent,
  SharedStudentLookupModule,
} from '@msh/shared/student-lookup';
import {
  GlobalToastService,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { BehaviorSubject } from 'rxjs';
import { A1ZFormModeEnum } from '../a1z-form-mode.enum';

interface ChangeEvent<T> {
  originalEvent: Event;
  value: T;
}

@UntilDestroy()
@Component({
  selector: 'msh-a1z-form',
  standalone: true,
  templateUrl: './a1z-form.component.html',
  styleUrls: ['./a1z-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    RadioButtonModule,
    InputTextareaModule,
    ButtonModule,
    CheckboxModule,
    DialogModule,
    ConfirmDialogModule,
    CalendarModule,
    DropdownModule,
    SharedStudentLookupModule,
    PasswordModule,
    SelectButtonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
    RippleModule,
  ],
  providers: [ConfirmationService],
})
export class A1zFormComponent implements OnInit {
  @Input()
  mode?: A1ZFormModeEnum;

  @Input()
  id?: string;

  @Input()
  studentId?: string;

  @ViewChild('form', { static: true }) form!: NgForm;

  EXAM_TYPES = EXAM_TYPES;

  a1Categories: DropdownModel<number>[] = [];

  d1ExamSubjects: DropdownModel<string>[] = [];
  d2ExamSubjects: DropdownModel<string>[] = [];
  d3ExamSubjects: DropdownModel<string>[] = [];
  z1ExamSubjects: DropdownModel<string>[] = [];

  filters: LazyLoadEvent | null = null;

  private studentList$$ = new BehaviorSubject<Student[]>([]);
  studentList$ = this.studentList$$.asObservable();
  totalRecords = 0;

  selectedStudent: Student | null = null;
  studentInputData = '';

  showStudentModal = false;
  enableD1Subject = false;
  enableD2Subject = false;
  enableD3Subject = false;
  enableZ1Subject = false;
  submitted = false;
  showStudentSearchButton = true;

  a1z: A1Z = {
    id: 0,
    yearOfSchoolA1Z: '',
  };

  booly: DropdownModel<boolean>[] = [
    { value: 'Po', key: true },
    { value: 'Jo', key: false },
  ];

  showCarriedModal = false;
  carriedModalType = EXAM_TYPES.D1;
  private carriedGrades$$ = new BehaviorSubject<CarriedGrade[]>([]);
  carriedGrades$ = this.carriedGrades$$.asObservable();
  a1ZReport: Report = Report.A1ZForm_Report;
  event = {
    first: 0,
    rows: 10,
    sortOrder: 1,
    filters: {},
    globalFilter: null,
  };

  constructor(
    private cd: ChangeDetectorRef,
    private readonly academicYearService: AcademicYearApiService,
    private readonly a1CategoryService: A1ZCategoryApiService,
    private readonly confirmationService: ConfirmationService,
    private readonly studentService: StudentsApiService,
    private readonly toastService: GlobalToastService,
    private readonly a1zService: A1ZApiService,
    private readonly examTypeService: ExamTypeApiService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly carriedGradeService: CarriedGradeApiService,
    private readonly router: Router,
    private readonly examSubjectService: ExamSubjectApiService,
    private reportsApiService: ReportsApiService
  ) {}

  ngOnInit(): void {
    this.showStudentSearchButton = A1ZFormModeEnum.Add === this.mode;

    this.a1CategoryService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.a1Categories = response.data;
      });

    this.academicYearService
      .getAcademicYears()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.a1z.yearOfSchoolA1Z = (response as any).data
          .filter((item: AcademicYear) => {
            return item.isActive;
          })
          .at(0)?.year;

        this.cd.detectChanges();
      });

    if (
      A1ZFormModeEnum.Edit === this.mode ||
      A1ZFormModeEnum.EditWithStudent === this.mode
    ) {
      this.a1zService
        .getOne(this.id)
        .pipe(untilDestroyed(this))
        .subscribe(response => {
          this.a1z = {...response.data};
          this.onSubjectD1Init(response.data);
          this.onSubjectD2Init(response.data);
          this.onSubjectD3Init(response.data);
          this.onSubjectZ1Init(response.data);
          this.cd.detectChanges();

          this.studentService
            .getById(this.a1z.studentId)
            .pipe(untilDestroyed(this))
            .subscribe(response => {
              this.setSelectedStudent(response.data);
              this.loadSubjectDropdowns();
              this.cd.detectChanges();
            });
        });
    } else if (A1ZFormModeEnum.AddWithStudent === this.mode) {
      this.studentService
        .getById(this.studentId)
        .pipe(untilDestroyed(this))
        .subscribe(response => {
          this.setSelectedStudent(response.data);
          this.loadSubjectDropdowns();
          this.cd.detectChanges();
        });
    }
  }

  onGridEvent(event: GridEvent<SharedStudent | SharedStudent[]>) {
    switch (event.action) {
      case GRID_ACTIONS.EDIT:
        this.setSelectedStudent(Object.assign({}, event.data as Student));
        this.loadSubjectDropdowns();
        this.showStudentModal = false;
        break;
    }
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.valid) {
      if (A1ZFormModeEnum.Add === this.mode || A1ZFormModeEnum.AddWithStudent == this.mode) {
        this.onNewA1ZFormSubmit();
      } else if (A1ZFormModeEnum.Edit === this.mode || A1ZFormModeEnum.EditWithStudent == this.mode) {
        this.onEditA1ZFormSubmit();
      } else {
        this.toastService.showError('Nuk dallohet qëllimi i kësaj forme.')
      }
    }
  }

  setSelectedStudent(student: any) {
    this.selectedStudent = student;

    if (!student) {
      this.studentInputData = ' ';
    } else {
      this.a1z.studentId = student.studentId;
      this.selectedStudent = student;
      this.studentInputData =
        student?.studentId +
        '-' +
        (student?.firstName ?? student?.studentFirstName) +
        '-' +
        (student?.lastName ?? student?.studentLastName);
    }
    this.cd.detectChanges();
  }

  isGraduationYearValid(): boolean {
    if (this.a1z.yearOfSchoolA1Z !== undefined) {
      const graduationYear = parseInt(this.a1z.yearOfSchoolA1Z, 10);
      return graduationYear <= new Date().getFullYear();
    }
    return false;
  }

  onSubjectD1Change($event: ChangeEvent<boolean>) {
    this.enableD1Subject = $event.value;
    if (!$event.value) {
      this.a1z.scoreD1 = undefined;
      this.a1z.yearD1 = undefined;
    }
  }

  onSubjectD2Change($event: ChangeEvent<boolean>) {
    this.enableD2Subject = $event.value;
    if (!$event.value) {
      this.a1z.scoreD2 = undefined;
      this.a1z.yearD2 = undefined;
    }
  }

  onSubjectD3Change($event: ChangeEvent<boolean>) {
    this.enableD3Subject = $event.value;
    if (!$event.value) {
      this.a1z.scoreD3 = undefined;
      this.a1z.yearD3 = undefined;
    }
  }

  onSubjectZ1Change($event: ChangeEvent<boolean>) {
    this.enableZ1Subject = $event.value;
    if (!$event.value) {
      this.a1z.scoreZ1 = undefined;
      this.a1z.yearZ1 = undefined;
    }
  }

  onSubjectD1Init(data: A1Z) {
    if (data.scoreD1) {
      this.enableD1Subject = true;
    }
  }

  onSubjectD2Init(data: A1Z) {
    if (data.scoreD2) {
      this.enableD2Subject = true;
    }
  }

  onSubjectD3Init(data: A1Z) {
    if (data.scoreD3) {
      this.enableD3Subject = true;
    }
  }

  onSubjectZ1Init(data: A1Z) {
    if (data.scoreZ1) {
      this.enableZ1Subject = true;
    }
  }

  getStudents($event: LazyLoadEvent): void {
    this.filters = Object.assign({}, $event);

    this.studentService
      .loadStudentsForA1A1Z($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.studentList$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  getGrades(type: EXAM_TYPES) {
    if (this.selectedStudent?.idCard) {
      this.carriedGradeService
        .getByNid(this.selectedStudent.idCard, type)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: value => {
            this.carriedGrades$$.next(value.data);
          },
          error: _ => {
            this.carriedGrades$$.next([]);
          },
        });
    } else {
      this.carriedGrades$$.next([]);
    }
  }

  onDownloadClick(grade: CarriedGrade) {
    this.carriedGradeService.downloadDocument(grade);
  }

  loadSubjectDropdowns() {
    this.examTypeService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(x => {
        const d1ExamType = x.data.find(d1 => d1.value === EXAM_TYPES.D1);
        const d2ExamType = x.data.find(d2 => d2.value === EXAM_TYPES.D2);
        const d3ExamType = x.data.find(d3 => d3.value === EXAM_TYPES.D3);
        const z1ExamType = x.data.find(z1 => z1.value === EXAM_TYPES.Z1);

        if (d1ExamType && d1ExamType.key) {
          this.examSubjectService
            .forExamType(
              d1ExamType.key,
              this.a1z.academicYearId,
              undefined,
              this.selectedStudent?.profileId
            )
            .pipe(untilDestroyed(this))
            .subscribe(y => {
              this.d1ExamSubjects = y.data;
              if (y.data != null && y.data.length > 0) {
                this.a1z.subjectD1Id = y.data[0]!.key!;
              }
              this.cd.detectChanges();
            });
        }
        if (d2ExamType && d2ExamType.key) {
          this.examSubjectService
            .forExamType(
              d2ExamType.key,
              this.a1z.academicYearId,
              undefined,
              this.selectedStudent?.profileId
            )
            .pipe(untilDestroyed(this))
            .subscribe(y => {
              this.d2ExamSubjects = y.data;
              if (y.data != null && y.data.length > 0) {
                this.a1z.subjectD2Id = y.data[0]!.key!;
              }
              this.cd.detectChanges();
            });
        }
        if (d3ExamType && d3ExamType.key) {
          this.examSubjectService
            .forExamType(
              d3ExamType.key,
              this.a1z.academicYearId,
              undefined,
              this.selectedStudent?.profileId
            )
            .pipe(untilDestroyed(this))
            .subscribe(y => {
              this.d3ExamSubjects = y.data;
              this.cd.detectChanges();
            });
        }
        if (z1ExamType && z1ExamType.key) {
          this.examSubjectService
            .forExamType(
              z1ExamType.key,
              this.a1z.academicYearId,
              undefined,
              this.selectedStudent?.profileId
            )
            .pipe(untilDestroyed(this))
            .subscribe(y => {
              this.z1ExamSubjects = y.data;
              this.cd.detectChanges();
            });
        }
      });
  }

  onStudentHide() {
    this.showStudentModal = false;
  }

  onExitForm() {
    this.router.navigate(['/applications/students']);
  }

  onNewA1ZFormSubmit() {
    this.manageSubjects();
    this.a1zService
      .save(this.a1z)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.a1z.academicYearId = response.data.academicYearId;
          this.toastService.showSuccess('Formulari A1Z u shtua me sukses!');

          this.printConfirmation(response.data);
        }
        if (!response.isSuccessful) {
          this.toastService.showError(
            response.errorMessage
              ? response.errorMessage
              : 'Ndodhi një problem gjatë shtimit të formularit A1Z!'
          );
        }
      });
  }

  onEditA1ZFormSubmit() {
    this.manageSubjects();
    this.a1zService
      .update(this.a1z)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Formulari A1Z u ndryshua me sukses!');

          this.printConfirmation(response.data);
        }

        if (!response.isSuccessful) {
          this.toastService.showError(
            response.errorMessage
              ? response.errorMessage
              : 'Ndodhi një problem gjatë ndryshimit të formularit A1Z!'
          );
        }
      });
  }

  manageSubjects() {
    if (!this.enableD1Subject) {
      this.a1z.scoreD1 = undefined;
      this.a1z.reasonD1 = undefined;
      this.a1z.yearD1 = undefined;
    }
    if (!this.enableD2Subject) {
      this.a1z.scoreD2 = undefined;
      this.a1z.reasonD2 = undefined;
      this.a1z.yearD2 = undefined;
    }
    if (!this.enableD3Subject) {
      this.a1z.scoreD3 = undefined;
      this.a1z.reasonD3 = undefined;
      this.a1z.yearD3 = undefined;
    }
    if (this.a1z.subjectD3Id !== undefined) {
      this.a1z.scoreD3 = undefined;
      this.a1z.reasonD3 = undefined;
      this.a1z.yearD3 = undefined;
    }
    if (this.a1z.subjectZ1Id !== undefined) {
      this.a1z.scoreZ1 = undefined;
      this.a1z.reasonZ1 = undefined;
      this.a1z.yearZ1 = undefined;
    }
  }

  onNewClick() {
    this.showStudentModal = true;
  }

  onCarriedClick(type: EXAM_TYPES) {
    this.getGrades(type);
    this.showCarriedModal = true;
    this.carriedModalType = type;
  }

  onCarriedHide() {
    this.showCarriedModal = false;
  }

  onGradeSelect($event: CarriedGrade) {
    this.onCarriedHide();

    switch ($event.examTypeName) {
      case EXAM_TYPES.D1:
        this.a1z.yearD1 = $event.year;
        this.a1z.scoreD1 = $event.grade;
        this.a1z.subjectNameD1 = $event.examSubject;
        this.cd.detectChanges();
        break;
      case EXAM_TYPES.D2:
        this.a1z.yearD2 = $event.year;
        this.a1z.scoreD2 = $event.grade;
        this.a1z.subjectNameD2 = $event.examSubject;
        this.cd.detectChanges();
        break;
      case EXAM_TYPES.D3:
        this.a1z.yearD3 = $event.year;
        this.a1z.scoreD3 = $event.grade;
        this.a1z.subjectNameD3 = $event.examSubject;
        this.cd.detectChanges();
        break;
      case EXAM_TYPES.Z1:
        this.a1z.yearZ1 = $event.year;
        this.a1z.scoreZ1 = $event.grade;
        this.a1z.subjectNameZ1 = $event.examSubject;
        this.cd.detectChanges();
        break;
    }
  }

  addCarriedGrade() {
    const queryParams: { queryParams: { [x: string]: string } } = {
      queryParams: {},
    };

    queryParams.queryParams['nid'] =
      this.selectedStudent?.idCard || 'undefined';

    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/applications/carried-grades'], queryParams)
    );

    window.open(url, '_blank');
  }

  private printConfirmation(a1: A1Z) {
    this.reportsApiService
      .loadRoleReports(this.event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        const a1ReportData = response.data.find(item => {
          return item.reportId === Report.A1ZForm_Report;
        });

        const query: { queryParams: { [x: string]: string } } = {
          queryParams: {},
        };
        if (
          this.mode === A1ZFormModeEnum.Add ||
          this.mode === A1ZFormModeEnum.Edit
        )
          query.queryParams['returnUrl'] = '/applications/a1z';
        else query.queryParams['returnUrl'] = '/applications/students';

        const parameters = JSON.parse(a1ReportData?.parameters as never);
        if (parameters.length > 0) {
          const parameterUrl = parameters.find(
            (item: string) => 'studentid' === item.toLowerCase()
          );
          const parameterYear = parameters.find(
            (item: string) => 'academicyearid' === item.toLowerCase()
          );

          if (
            parameterUrl &&
            parameterYear &&
            a1.studentId &&
            a1.academicYearId
          ) {
            query.queryParams[`${parameterUrl}`] = a1.studentId;
            query.queryParams[`${parameterYear}`] =
              a1.academicYearId.toString();
          } else {
            this.toastService.showError(
              'Mungojne parametrat e konfigurimit te raportit'
            );
            return;
          }
        }
        this.router.navigate([`/reports/view/${this.a1ZReport}`], query).then();
      });
  }

  editStudent() {
    this.router.navigate([
      '/applications/students/edit',
      this.selectedStudent?.id,
    ]);
  }

  protected readonly A1ZFormModeEnum = A1ZFormModeEnum;
}
