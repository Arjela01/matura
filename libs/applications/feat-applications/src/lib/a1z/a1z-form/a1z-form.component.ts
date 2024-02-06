import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  A1ZApiService,
  ExamGradeApiService,
} from '@msh/applications/data-access-applications';
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
  ExamGrade,
  ExamType,
  Report,
  Student,
} from '@msh/shared/domain-models';
import {
  SharedStudent,
  SharedStudentLookupModule,
} from '@msh/shared/student-lookup';
import {
  GRID_ACTIONS,
  GlobalToastService,
  GridEvent,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { BehaviorSubject } from 'rxjs';
import { CarriedGradesFormComponent } from '../../carried-grade/carried-grade-form/carried-grade-form.component';
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
    CarriedGradesFormComponent,
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

  a1Categories: DropdownModel<number>[] = [];

  d1ExamSubjects: DropdownModel<string>[] = [];
  d2ExamSubjects: DropdownModel<string>[] = [];
  d3ExamSubjects: DropdownModel<string>[] = [];
  z1ExamSubjects: DropdownModel<string>[] = [];

  examTypeD1: any;
  examTypeD2: any;
  examTypeD3: any;
  examTypeZ1: any;

  filters: TableLazyLoadEvent | null = null;

  private studentList$$ = new BehaviorSubject<Student[]>([]);
  studentList$ = this.studentList$$.asObservable();
  totalRecords = 0;

  selectedStudent!: Student;
  studentInputData = '';

  showStudentModal = false;
  academicYearsDropdown: DropdownModel<number>[] = [];
  examTypes: ExamType[] = [];

  submitted = false;
  showStudentSearchButton = true;
  displayModal = false;

  a1z: A1Z = {
    isApplyingToForeignCountries: false,
    alreadyHaveDiploma: false,
  };

  booly: DropdownModel<boolean>[] = [
    { value: 'Po', key: true },
    { value: 'Jo', key: false },
  ];

  event = {
    first: 0,
    rows: 10,
    sortOrder: 1,
    filters: {},
    globalFilter: null,
  };
  disabled = false;

  constructor(
    private cd: ChangeDetectorRef,
    private readonly academicYearService: AcademicYearApiService,
    private readonly a1CategoryService: A1ZCategoryApiService,
    private readonly studentService: StudentsApiService,
    private readonly toastService: GlobalToastService,
    private readonly a1zService: A1ZApiService,
    private readonly examTypeService: ExamTypeApiService,
    private readonly carriedGradeService: CarriedGradeApiService,
    private readonly examGradeApiService: ExamGradeApiService,
    private readonly router: Router,
    private readonly examSubjectService: ExamSubjectApiService,
    private examSubjectApiService: ExamSubjectApiService
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
        this.academicYearsDropdown = response.data;
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
          this.a1z = { ...response.data };

          this.cd.detectChanges();

          this.studentService
            .getById(this.a1z.studentId)
            .pipe(untilDestroyed(this))
            .subscribe(response => {
              this.setSelectedStudent(response.data);
              this.loadSubjectDropdowns();

              this.onSubjectD1Init(response.data);
              this.onSubjectD2Init(response.data);
              this.onSubjectD3Init(response.data);
              this.onSubjectZ1Init(response.data);

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

  onStudentGridEvent(event: GridEvent<SharedStudent | SharedStudent[]>) {
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

    if (
      (A1ZFormModeEnum.Add === this.mode ||
        A1ZFormModeEnum.AddWithStudent == this.mode) &&
      this.isGraduationYearValid()
    ) {
      this.onNewA1ZFormSubmit();
    } else if (
      (A1ZFormModeEnum.Edit === this.mode ||
        A1ZFormModeEnum.EditWithStudent == this.mode) &&
      this.isGraduationYearValid()
    ) {
      this.onEditA1ZFormSubmit();
    } else {
      this.toastService.showError(
        'Nuk dallohet qëllimi i kësaj forme ose viti i diplomimit është i pavlefshëm.'
      );
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
        (student?.firstName ?? '') +
        '-' +
        (student?.lastName ?? '');
    }
    this.cd.detectChanges();
  }

  isGraduationYearValid(): boolean {
    if (this.a1z.yearOfSchoolA1Z !== undefined) {
      const graduationYear = this.a1z.yearOfSchoolA1Z;
      return graduationYear <= new Date().getFullYear();
    }
    return false;
  }

  onCarryZ1Change($event: ChangeEvent<boolean>) {
    this.a1z.carryZ1 = $event.value;
    this.a1z.scoreZ1 = undefined;
    this.a1z.academicYearZ1Name = undefined;
    this.a1z.academicYearZ1Id = undefined;
    this.a1z.carriedGradeZ1Id = undefined;
    this.a1z.carriedGradeZ1SubjectName = undefined;
    this.a1z.reasonZ1 = undefined;
    this.a1z.subjectZ1Id = undefined;
    this.a1z.subjectZ1Name = undefined;

    if (!$event.value) {
      const examType = this.examTypes.find(x => x.name === EXAM_TYPES.Z1);

      this.examSubjectApiService
        .forExamType(
          examType?.id ?? 0,
          this.a1z.academicYearId,
          this.a1z.subjectZ1Id,
          this.selectedStudent.profileId,
          false,
          undefined
        )
        .pipe(untilDestroyed(this))
        .subscribe(response => {
          this.z1ExamSubjects = response.data;
          this.cd.detectChanges();
        });
    }
    if (this.a1z.carryZ1) {
      this.discoverGrade(EXAM_TYPES.Z1, this.a1z.subjectZ1Id);
    }
    this.cd.detectChanges();
  }

  discoverGrade(examType: string, examSubjectId?: string) {
    const examTypeRecord = this.examTypes.find(x => x.name === examType);

    if (examTypeRecord) {
      this.examGradeApiService
        .discoverGrade(
          examTypeRecord.id ?? 0,
          this.selectedStudent.idCard,
          examSubjectId
        )
        .subscribe(response => {
          if (response.isSuccessful) {
            switch (examType) {
              case EXAM_TYPES.D1:
                if (response.data.grade ?? 0 >= 4.5) {
                  this.a1z.discoveredScoreD1 = response.data.grade;
                  if (!this.a1z.scoreD1) this.a1z.scoreD1 = response.data.grade;
                } else this.a1z.discoveredScoreD1 = undefined;

                break;
              case EXAM_TYPES.D2:
                if (response.data.grade ?? 0 >= 4.5) {
                  this.a1z.discoveredScoreD2 = response.data.grade;
                  if (!this.a1z.scoreD2) this.a1z.scoreD2 = response.data.grade;
                } else this.a1z.discoveredScoreD2 = undefined;
                break;
              case EXAM_TYPES.D3:
                if (response.data.grade ?? 0 >= 4.5) {
                  this.a1z.discoveredScoreD3 = response.data.grade;
                  if (!this.a1z.scoreD3) this.a1z.scoreD3 = response.data.grade;
                } else this.a1z.discoveredScoreD3 = undefined;
                break;
              case EXAM_TYPES.Z1:
                if (response.data.grade ?? 0 >= 4.5) {
                  this.a1z.discoveredScoreZ1 = response.data.grade;
                  if (!this.a1z.scoreZ1) this.a1z.scoreZ1 = response.data.grade;
                } else this.a1z.discoveredScoreZ1 = undefined;
                break;
            }
            this.cd.detectChanges();
          }
        });
    }
  }

  onAcademicYearZ1Change($event: any) {
    this.a1z.academicYearZ1Id = $event.value;

    const examType = this.examTypes.find(x => x.name === EXAM_TYPES.Z1);

    this.examSubjectApiService
      .forExamType(
        examType?.id ?? 0,
        this.a1z.academicYearZ1Id,
        undefined,
        this.selectedStudent.profileId,
        !(examType?.dependsOnSchoolProfile ?? true),
        undefined
      )
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.z1ExamSubjects = response.data;
        this.cd.detectChanges();
      });
  }

  onSubjectD1Init(data: A1Z) {
    if (data.scoreD1) {
      this.a1z.carryD1 = true;
    }
  }

  onSubjectD2Init(data: A1Z) {
    if (data.scoreD2) {
      this.a1z.carryD2 = true;
    }
  }

  onSubjectD3Init(data: A1Z) {
    if (data.scoreD3) {
      this.a1z.carryD3 = true;
    }
  }

  onSubjectZ1Init(data: A1Z) {
    if (data.scoreZ1) {
      this.a1z.carryZ1 = true;
    }
  }

  getStudents($event: TableLazyLoadEvent): void {
    this.filters = Object.assign({}, $event);

    this.studentService
      .loadStudentsForA1A1Z($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.studentList$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  loadSubjectDropdowns() {
    this.examTypeService
      .getAll()
      .pipe(untilDestroyed(this))
      .subscribe(x => {
        this.examTypes = x.data;
        const d1ExamType = x.data.find(d1 => d1.name === EXAM_TYPES.D1);
        const d2ExamType = x.data.find(d2 => d2.name === EXAM_TYPES.D2);
        const d3ExamType = x.data.find(d3 => d3.name === EXAM_TYPES.D3);
        const z1ExamType = x.data.find(z1 => z1.name === EXAM_TYPES.Z1);

        this.discoverGrade(EXAM_TYPES.D1, this.a1z.subjectD1Id);
        this.discoverGrade(EXAM_TYPES.D2, this.a1z.subjectD2Id);
        this.discoverGrade(EXAM_TYPES.D3, this.a1z.subjectD3Id);
        this.discoverGrade(EXAM_TYPES.Z1, this.a1z.subjectZ1Id);

        if (d1ExamType && d1ExamType.name) {
          this.examSubjectService
            .forExamType(
              d1ExamType.id,
              this.a1z.academicYearId,
              undefined,
              this.selectedStudent?.profileId,
              !(d1ExamType?.dependsOnSchoolProfile ?? true)
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
        if (d2ExamType && d2ExamType.id) {
          this.examSubjectService
            .forExamType(
              d2ExamType.id,
              this.a1z.academicYearId,
              undefined,
              this.selectedStudent?.profileId,
              !(d2ExamType?.dependsOnSchoolProfile ?? true)
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
        if (d3ExamType && d3ExamType.id) {
          this.examSubjectService
            .forExamType(
              d3ExamType.id,
              this.a1z.academicYearId,
              this.a1z.subjectD3Id,
              this.selectedStudent?.profileId,
              !(d3ExamType?.dependsOnSchoolProfile ?? true)
            )
            .pipe(untilDestroyed(this))
            .subscribe(y => {
              this.d3ExamSubjects = y.data;
              this.cd.detectChanges();
            });
        }
        if (z1ExamType && z1ExamType.id) {
          this.examSubjectService
            .forExamType(
              z1ExamType.id,
              this.a1z.academicYearId,
              this.a1z.subjectZ1Id,
              this.selectedStudent?.profileId,
              !(z1ExamType?.dependsOnSchoolProfile ?? true)
            )
            .pipe(untilDestroyed(this))
            .subscribe(y => {
              this.z1ExamSubjects = y.data;
              this.cd.detectChanges();
            });
        }
        this.examTypeD1 = d1ExamType;
        this.examTypeD2 = d2ExamType;
        this.examTypeD3 = d3ExamType;
        this.examTypeZ1 = z1ExamType;
      });
  }

  onStudentHide() {
    this.showStudentModal = false;
  }

  onExitForm() {
    this.router.navigate(['/applications/students']);
  }

  onNewA1ZFormSubmit() {
    this.disabled = true;
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
          this.enableSaveButton();
          this.toastService.showError(
            response.errorMessage
              ? response.errorMessage
              : 'Ndodhi një problem gjatë shtimit të formularit A1Z!'
          );
        }
      });
  }

  onEditA1ZFormSubmit() {
    this.disabled = true;
    this.a1zService
      .update(this.a1z)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Formulari A1Z u ndryshua me sukses!');

          this.printConfirmation(response.data);
        }

        if (!response.isSuccessful) {
          this.enableSaveButton();
          this.toastService.showError(
            response.errorMessage
              ? response.errorMessage
              : 'Ndodhi një problem gjatë ndryshimit të formularit A1Z!'
          );
        }
      });
  }

  onNewClick() {
    this.showStudentModal = true;
  }

  private enableSaveButton() {
    this.disabled = false;
    this.cd.detectChanges();
  }

  private printConfirmation(a1z: A1Z) {
    const query: { queryParams: { [x: string]: string } } = {
      queryParams: {},
    };
    if (this.mode === A1ZFormModeEnum.Add || this.mode === A1ZFormModeEnum.Edit)
      query.queryParams['returnUrl'] = '/applications/a1z';
    else query.queryParams['returnUrl'] = '/applications/students';

    const parameterUrl = 'studentid';

    const parameterYear = 'academicyearid';

    if (parameterUrl && parameterYear && a1z.studentId && a1z.academicYearId) {
      query.queryParams[`${parameterUrl}`] = a1z.studentId;
      query.queryParams[`${parameterYear}`] = a1z.academicYearId.toString();
    } else {
      this.toastService.showError(
        'Mungojne parametrat e konfigurimit te raportit'
      );
      return;
    }

    const id = this.a1z.id ?? a1z.id;
    this.router
      .navigate([`/reports/a1-view/${id}/${Report.A1ZForm_Report}`], query)
      .then();
  }

  editStudent() {
    this.router.navigate([
      '/applications/students/edit',
      this.selectedStudent?.id,
    ]);
  }

  protected readonly A1ZFormModeEnum = A1ZFormModeEnum;

  onZ1SubjectChange($event: DropdownChangeEvent) {
    this.discoverGrade(EXAM_TYPES.Z1, this.a1z.subjectZ1Id);
  }
}
