import { A1Z } from '../../../../../domain-applications';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  EventEmitter,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { A1ZApiService } from '@msh/applications/data-access-applications';
import {
  A1ZCategoryApiService,
  AcademicYearApiService,
  ExamGradeApiService,
  ExamSubjectApiService,
  StudentsApiService,
} from '@msh/configurations/data-access-configurations';
import { Student } from '@msh/configurations/domain-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
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
export class A1zFormComponent implements OnInit, OnChanges, DoCheck {
  @Output() formSave = new EventEmitter<A1Z>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;
  academicYears: DropdownModel<number>[] = [];
  a1Categories: DropdownModel<number>[] = [];
  examSubjects: DropdownModel<number>[] = [];
  filters: LazyLoadEvent | null = null;

  //TODO: Replace any with ExamGrade model
  examGrades: any[] | any = null;

  private studentList$$ = new BehaviorSubject<Student[]>([]);
  studentList$ = this.studentList$$.asObservable();
  totalRecords = 0;

  selectedStudent: any = null;
  studentInputData = '';

  showStudentModal = false;
  disableD1Subject = false;
  disableD2Subject = false;
  disableD3Subject = false;
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
    private readonly activatedRoute: ActivatedRoute,
    private readonly examGradeSercice: ExamGradeApiService,
    private readonly router: Router,
    private readonly examSubjectService: ExamSubjectApiService
  ) {}

  ngDoCheck(): void {
    if (
      this.a1z.noCarriedSubjets !== 4 ||
      this.a1z.noCarriedSubjets !== undefined
    ) {
      this.onNeededSubjectChange({
        value: this.a1z,
      });
    }
    if (this.studentInputData !== undefined) {
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
    this.examSubjectService.loadDropDownList().subscribe(response => {
      this.examSubjects = response.data;
    });
    this.activatedRoute.params.subscribe(x => {
      this.a1zService.getOne(x['id']).subscribe(y => {
        this.a1z = y.data;
        this.onStudentInit(y.data);
        //TODO: When exam grade implemented uncomment the following lines
        // this.examGradeSercice.getExamGrade(this.a1z.id!).subscribe(response => {
        //   this.examGrades = response.data;
        // });
        console.log(this.a1z);
      });
    });
    console.log('init');
  }

  ngOnChanges(): void {
    this.onNeededSubjectChange({
      value: this.a1z,
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

  onStudentInit(event: any) {
    if (!event) {
      this.a1z.studentInputData = ' ';
    } else {
      console.log(event);
      this.studentInputData =
        event?.studentIdentifier +
        '-' +
        event?.studentFirstName +
        '-' +
        event?.studentFatherName +
        '-' +
        event?.studentLastName;
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
        student?.fatherName +
        '-' +
        student?.lastName;
    }
  }

  onSubjectD1Change($event: any) {
    this.disableD1Subject =
      ($event.value.noCarriedSubjets === 1 && $event.value.carriedSubjectD2) ||
      $event.value.carriedSubjectD3 ||
      $event.value.noCarriedSubjets === 0;
  }

  onSubjectD2Change($event: any) {
    this.disableD2Subject =
      ($event.value.noCarriedSubjets === 1 && $event.value.carriedSubjectD1) ||
      $event.value.carriedSubjectD3 ||
      $event.value.noCarriedSubjets === 0;
  }

  onSubjectD3Change($event: any) {
    this.disableD3Subject =
      ($event.value.noCarriedSubjets === 1 && $event.value.carriedSubjectD2) ||
      $event.value.carriedSubjectD1 ||
      $event.value.noCarriedSubjets === 0;
  }

  onNeededSubjectChange($event: any) {
    this.onSubjectD1Change($event);
    this.onSubjectD2Change($event);
    this.onSubjectD3Change($event);

    if ($event.value.noCarriedSubjets === 3) {
      this.disableD1Subject = false;
      this.disableD2Subject = false;
      this.disableD3Subject = false;
    }

    // There was a problem when disabling the input fields if radio button nr 2 was selected. The logic above didn't work in that case.
    if ($event.value.noCarriedSubjets === 2) {
      if ($event.value.carriedSubjectD2 && $event.value.carriedSubjectD3) {
        this.disableD1Subject = true;
      } else {
        this.disableD1Subject = false;
      }
      if ($event.value.carriedSubjectD1 && $event.value.carriedSubjectD3) {
        this.disableD2Subject = true;
      } else {
        this.disableD2Subject = false;
      }
      if ($event.value.carriedSubjectD1 && $event.value.carriedSubjectD2) {
        this.disableD3Subject = true;
      } else {
        this.disableD3Subject = false;
      }
    }
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
    this.a1zService
      .update(this.a1z)
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
}
