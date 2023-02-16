/* eslint-enable @typescript-eslint/no-unused-vars */
/* eslint-enable @typescript-eslint/no-non-null-assertion */
/* eslint-enable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  EventEmitter,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { A1ZApiService } from '@msh/applications/data-access-applications';
import { A1Z } from '@msh/applications/domain-application';
import {
  A1ZCategoryApiService,
  AcademicYearApiService,
  ExamGradeApiService,
  ExamSubjectApiService,
  ExamTypeApiService,
  StudentsApiService,
} from '@msh/configurations/data-access-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { Student } from '@msh/shared/domain-models';
import {
  GRID_ACTIONS,
  GlobalToastService,
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
import { RadioButtonModule } from 'primeng/radiobutton';
import { BehaviorSubject } from 'rxjs';
import { A1zStudentSearchComponent } from '../a1z-student-search/a1z-student-search.component';
import { EXAM_TYPES } from './exam-type.enum';
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
    A1zStudentSearchComponent,
  ],
  providers: [ConfirmationService],
})
export class A1zFormComponent implements OnInit, OnChanges, DoCheck, OnDestroy {
  @Output() formSave = new EventEmitter<A1Z>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;
  @ViewChild('checkboxD1') checkboxD1!: any;
  academicYears: DropdownModel<number>[] = [];
  a1Categories: DropdownModel<number>[] = [];
  d1ExamSubjects: DropdownModel<string>[] = [];
  d2ExamSubjects: DropdownModel<string>[] = [];
  d3ExamSubjects: DropdownModel<string>[] = [];
  z1ExamSubjects: DropdownModel<string>[] = [];
  d3ExamSubjectsFall: DropdownModel<string>[] = [];
  z1ExamSubjectsFall: DropdownModel<string>[] = [];
  filters: LazyLoadEvent | null = null;

  //TODO: Replace any with ExamGrade model
  examGrades: any[] | any = null;

  formId: string | null;

  private studentList$$ = new BehaviorSubject<Student[]>([]);
  studentList$ = this.studentList$$.asObservable();
  totalRecords = 0;

  selectedStudent: any = null;
  studentInputData = '';

  showStudentModal = false;
  enableD1Subject = false;
  enableD2Subject = false;
  enableD3Subject = false;
  enableZ1Subject = false;
  hideZ1Subject = false;
  submitted = false;

  a1z: A1Z = {
    id: 0,
    academicYearId: undefined,
    studentInputData: undefined,
    isApplyingToForeignCountries: false,
    a1ZCategoryId: undefined,
    alreadyHaveDiploma: true,
    carriedGradeZ1: undefined,
    carriedGradeD1: undefined,
    carriedGradeD2: undefined,
    carriedGradeD3: undefined,
    carriedReasonAZ1: undefined,
    carriedReasonD1: undefined,
    carriedReasonD2: undefined,
    carriedReasonD3: undefined,
    carriedSubjectZ1: undefined,
    carriedSubjectD1: undefined,
    carriedSubjectD2: undefined,
    carriedSubjectD3: undefined,
    noCarriedSubjets: 0,
    noCarriedSubjetsZ: 0,
    isA1: false,
    overSeerCode: undefined,
    studentId: 'F701CD86-BF0A-4BF5-D400-08DAFE286BC9',
    subjectD1A1ZId: undefined,
    subjectD2A1ZId: undefined,
    subjectD3A1ZId: undefined,
    subjectZ1A1ZId: undefined,
    yearOfSchoolA1Z: undefined,
    yearZ1: undefined,
    scoreD1A1Z: undefined,
    scoreD2A1Z: undefined,
    scoreD3A1Z: undefined,
    scoreZ1A1Z: undefined,
    scoreZ2A1Z: undefined,
  };

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      if (this.a1z.id === 0) {
        this.onNewA1ZFormSubmit();
      } else {
        this.onEditA1ZFormSubmit();
      }
    }
  }

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
    private readonly examGradeSercice: ExamGradeApiService,
    private readonly router: Router,
    private readonly examSubjectService: ExamSubjectApiService
  ) {
    this.formId = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnDestroy(): void {
    console.log('destroyed');
  }

  ngDoCheck(): void {
    if (this.a1z.studentId !== undefined) {
      this.onStudentInit(this.a1z);
    }
    if (this.selectedStudent !== null) {
      this.onStudentChange(this.selectedStudent);
    }
  }

  ngOnInit(): void {
    this.academicYearService.loadDropdownList().subscribe(response => {
      this.academicYears = response.data;
    });
    this.a1CategoryService.loadDropdownList().subscribe(response => {
      this.a1Categories = response.data;
    });
    this.getSubjectDropdown({
      value: this.a1z.academicYearId,
    });
    if (this.formId !== null) {
      this.a1zService.getOne(parseInt(this.formId!)).subscribe(response => {
        this.a1z = response.data;
        this.a1z.noCarriedSubjets = 0;
        this.a1z.noCarriedSubjetsZ = 0;
        this.a1z.carriedSubjectD3 = response.data.subjectD3A1ZId;
        this.onSubjectD1Init(response.data);
        this.onSubjectD2Init(response.data);
        this.onSubjectD3Init(response.data);
        this.onSubjectZ1Init(response.data);
        this.a1z.carriedSubjectZ1 = response.data.subjectZ1A1ZId;
        this.cd.detectChanges();
        //TODO: When exam grade implemented uncomment the following lines
        // this.examGradeSercice.getExamGrade(this.a1z.id!).subscribe(response => {
        //   this.examGrades = response.data;
        // });
      });
    }
    console.log('init');
  }

  ngOnChanges(): void {
    this.getSubjectDropdown({
      value: this.a1z.academicYearId,
      isFall: this.selectedStudent.isFall,
    });
  }

  onGridEvent(event: GridEvent<Student | Student[]>) {
    switch (event.action) {
      case GRID_ACTIONS.EDIT:
        this.selectedStudent = Object.assign({}, event.data);
        console.log(event.data);
        this.showStudentModal = false;
        break;
    }
  }

  onStudentInit(student: any) {
    if (!student) {
      this.a1z.studentInputData = ' ';
    } else {
      this.a1z.studentId = student.studentId;
      this.studentInputData =
        student?.studentIdentifier +
        '-' +
        student?.studentFirstName +
        '-' +
        student?.studentFatherName +
        '-' +
        student?.studentLastName;
    }
  }

  onStudentChange(student: any) {
    if (!student) {
      this.a1z.studentInputData = ' ';
    } else {
      this.a1z.studentId = student.id;
      this.studentInputData =
        student?.studentId +
        '-' +
        student?.firstName +
        '-' +
        student?.middleName +
        '-' +
        student?.lastName;
    }
  }

  onSubjectD1Change($event: any) {
    this.enableD1Subject = $event.checked;
    this.enableD1Subject === true
      ? (this.a1z.noCarriedSubjets = this.a1z.noCarriedSubjets + 1)
      : (this.a1z.noCarriedSubjets = this.a1z.noCarriedSubjets - 1);

    console.log(this.a1z.noCarriedSubjets);
  }

  onSubjectD1Init(data: A1Z) {
    if (data.scoreD1A1Z !== 0) {
      this.a1z.noCarriedSubjets = this.a1z.noCarriedSubjets + 1;
      this.enableD1Subject = true;
    }
  }

  onSubjectD2Change($event: any) {
    this.enableD2Subject = $event.checked;
    this.enableD2Subject === true
      ? (this.a1z.noCarriedSubjets = this.a1z.noCarriedSubjets + 1)
      : (this.a1z.noCarriedSubjets = this.a1z.noCarriedSubjets - 1);
    console.log(this.a1z.noCarriedSubjets);
  }

  onSubjectD2Init(data: A1Z) {
    if (data.scoreD2A1Z !== 0) {
      this.a1z.noCarriedSubjets = this.a1z.noCarriedSubjets + 1;
      this.enableD2Subject = true;
    }
  }

  onSubjectD3Change($event: any) {
    this.enableD3Subject = $event.checked;
    this.enableD3Subject === true
      ? (this.a1z.noCarriedSubjets = this.a1z.noCarriedSubjets + 1)
      : (this.a1z.noCarriedSubjets = this.a1z.noCarriedSubjets - 1);
    console.log(this.a1z.noCarriedSubjets);
  }

  onSubjectD3Init(data: A1Z) {
    if (data.scoreD3A1Z !== 0) {
      this.a1z.noCarriedSubjets = this.a1z.noCarriedSubjets + 1;
      this.enableD3Subject = true;
    }
  }

  onSubjectZ1Init(data: A1Z) {
    if (data.scoreZ1A1Z !== 0) {
      this.a1z.noCarriedSubjetsZ = this.a1z.noCarriedSubjetsZ + 1;
      this.enableZ1Subject = true;
    }
  }

  onSubjectZ1Change($event: any) {
    this.enableZ1Subject = $event.checked;
    this.enableZ1Subject === true
      ? (this.a1z.noCarriedSubjetsZ = this.a1z.noCarriedSubjetsZ + 1)
      : (this.a1z.noCarriedSubjetsZ = this.a1z.noCarriedSubjetsZ - 1);
    console.log(this.a1z.noCarriedSubjetsZ);
  }

  getStudents($event: LazyLoadEvent): void {
    this.filters = Object.assign({}, $event);

    this.studentService
      .loadStudents($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        console.log(response);
        this.studentList$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  getSubjectDropdown($event: any) {
    this.examTypeService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(x => {
        const d1ExamType = x.data.find(
          d1 => d1.value === EXAM_TYPES.D1 || d1.value === EXAM_TYPES.D1_VJESHTA
        );
        const d2ExamType = x.data.find(
          d2 => d2.value === EXAM_TYPES.D2 || d2.value === EXAM_TYPES.D2_VJESHTA
        );
        const d3ExamType = x.data.find(d3 => d3.value === EXAM_TYPES.D3);
        const d3ExamTypeFall = x.data.find(
          d3 => d3.value === EXAM_TYPES.D3_VJESHTA
        );
        const z1ExamType = x.data.find(
          z1 => z1.value === EXAM_TYPES.Z1 || z1.value === EXAM_TYPES.Z1_VJESHTA
        );
        const z1ExamTypeFall = x.data.find(
          z1 => z1.value === EXAM_TYPES.Z1_VJESHTA
        );

        this.examSubjectService
          .forExamType(d1ExamType!.key!, this.a1z.academicYearId)
          .pipe(untilDestroyed(this))
          .subscribe(y => {
            this.d1ExamSubjects = y.data;
            this.a1z.carriedSubjectD1 = this.d1ExamSubjects[0].key!;
            this.a1z.subjectD1A1ZId = this.d1ExamSubjects[0].key!;
            this.cd.detectChanges();
          });
        this.examSubjectService
          .forExamType(d2ExamType!.key!, this.a1z.academicYearId)
          .pipe(untilDestroyed(this))
          .subscribe(y => {
            this.d2ExamSubjects = y.data;
            this.a1z.carriedSubjectD2 = this.d2ExamSubjects[0].key!;
            this.a1z.subjectD2A1ZId = this.d2ExamSubjects[0].key!;
            this.cd.detectChanges();
          });

        this.examSubjectService
          .forExamType(d3ExamTypeFall!.key!, this.a1z.academicYearId)
          .pipe(untilDestroyed(this))
          .subscribe(y => {
            this.d3ExamSubjectsFall = y.data;
            this.cd.detectChanges();
          });
        this.examSubjectService
          .forExamType(z1ExamTypeFall!.key!, this.a1z.academicYearId)
          .pipe(untilDestroyed(this))
          .subscribe(y => {
            this.z1ExamSubjectsFall = y.data;
          });

        this.examSubjectService
          .forExamType(d3ExamType!.key!, this.a1z.academicYearId)
          .pipe(untilDestroyed(this))
          .subscribe(y => {
            this.d3ExamSubjects = this.d3ExamSubjectsFall.concat(y.data);
          });
        this.examSubjectService
          .forExamType(z1ExamType!.key!, this.a1z.academicYearId)
          .pipe(untilDestroyed(this))
          .subscribe(y => {
            this.z1ExamSubjects = this.z1ExamSubjectsFall.concat(y.data);
          });
      });
  }

  onStudentShow() {
    this.showStudentModal = true;
  }

  onStudentHide() {
    this.showStudentModal = false;
  }

  onExitForm() {
    this.router.navigate(['/applications/a1z']);
  }

  onNewA1ZFormSubmit() {
    this.manageSubjects();
    this.a1zService
      .save(this.a1z)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Formulari A1Z u shtua me sukses!');
          this.router.navigate(['applications/a1z']);
          console.log(response);
        }

        if (response.isSuccessful === false) {
          this.toastService.showError(
            'Ndodhi një problem gjatë shtimit të formularit A1Z!'
          );
          console.log(response);
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
          this.router.navigate(['applications/a1z']);
          console.log(response);
        }

        if (response.isSuccessful === false) {
          this.toastService.showError(
            'Ndodhi një problem gjatë shtimit të formularit A1Z!'
          );
          console.log(response);
        }
      });
  }

  manageSubjects() {
    if (this.enableD1Subject === false) {
      this.a1z.carriedSubjectD1 = undefined;
      this.a1z.scoreD1A1Z = undefined;
    }
    if (this.enableD2Subject === false) {
      this.a1z.carriedSubjectD2 = undefined;
      this.a1z.scoreD2A1Z = undefined;
    }
    if (this.enableD3Subject === false) {
      this.a1z.carriedSubjectD3 = undefined;
      this.a1z.scoreD3A1Z = undefined;
    }
    if (this.a1z.carriedSubjectD3 !== undefined) {
      this.a1z.subjectD3A1ZId = this.a1z.carriedSubjectD3;
    }
    if (this.a1z.carriedSubjectZ1 !== undefined) {
      this.a1z.subjectZ1A1ZId = this.a1z.carriedSubjectZ1;
    }
    if (this.enableZ1Subject === false) {
      this.a1z.carriedSubjectZ1 = undefined;
      this.a1z.scoreZ1A1Z = undefined;
    }
  }
}
