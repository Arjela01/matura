import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { A1ApiService } from '@msh/applications/data-access-applications';
import { A1 } from '@msh/applications/domain-application';
import {
  AcademicYearApiService,
  ExamSubjectApiService,
  StudentsApiService,
} from '@msh/configurations/data-access-configurations';
import { AcademicYear } from '@msh/configurations/domain-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { GlobalToastService } from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { combineLatest, Observable } from 'rxjs';
import { ManageStudentsGridsDialogComponent } from '../manage-students-grids-dialog/manage-students-grids-dialog.component';

const Z1 = 26;
const D3 = 4;
const INITIAL_FILTER = {
  registrationYear: [
    {
      value: 2023,
      matchMode: 'equals',
      operator: 'and',
    },
  ],
};
@Component({
  selector: 'a1-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    RadioButtonModule,
    InputTextareaModule,
    ButtonModule,
    CheckboxModule,
    DropdownModule,
    RippleModule,
    TableModule,
  ],
  templateUrl: './a1-form.component.html',
  styleUrls: ['./a1-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
@UntilDestroy()
export class A1FormComponent {
  d3SubjectChoosen = '';
  optionalSubjectChoosen: any = null;
  moreSubjectThanAllowed = false;
  subjectsChoosen: any[] = [];
  choosenStudent: string | null = null;
  academicYear?: AcademicYear | null = null;
  optionalSubjects: DropdownModel<number>[] = [];
  d3Dropdown: DropdownModel<number>[] = [];
  d1Dropdown: DropdownModel<number>[] = [];
  d2Dropdown: DropdownModel<number>[] = [];
  @ViewChild('form', { static: false }) form!: NgForm;
  ref?: DynamicDialogRef;
  submitted = false;
  a1: A1 = {
    id: '',
    academicYearId: '',
    studentId: '',
    isA1: true,
    isApplyingToForeignCountries: false,
    alreadyHaveDiploma: false,
    subjectD3A1Id: '',
    subjectZ1A1Id: '',
    subjectZ2A1Id: '',
    subjectZ3A1Id: '',
    overSeerCode: '',
  };
  studentsConfig = {
    first: 0,
    rows: 10,
    sortOrder: 1,
    filters: {},
    globalFilter: null,
  };
  showForm: boolean = false;
  students: any | null = null;
  id: string | null = null;

  constructor(
    private cd: ChangeDetectorRef,
    private a1ApiService: A1ApiService,
    private toastService: GlobalToastService,
    private academicYearService: AcademicYearApiService,
    private studentsApiService: StudentsApiService,
    private examSubjectsService: ExamSubjectApiService,
    private dialogService: DialogService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.initializeFormWithApiCalls();
  }

  initializeFormWithApiCalls() {
    let apiCalls = [
      this.getAcademicYears(),
      this.getStudent(),
      this.getOptionalSubjects(),
      this.getD3Subjects(),
    ];
    if (!this.id) {
      combineLatest(apiCalls)
        .pipe(untilDestroyed(this))
        .subscribe(([years, students, z1, d3]) => {
          this.showForm = true;
          this.academicYear = years['data'].find(
            (year: AcademicYear) => year.isActive
          );
          this.a1.academicYearId = this.academicYear?.id;
          this.students = students;
          this.optionalSubjects = z1.data;
          this.d3Dropdown = d3.data;
          this.cd.detectChanges();
        });
    } else {
      apiCalls.push(this.getA1ById());
      combineLatest(apiCalls)
        .pipe(untilDestroyed(this))
        .subscribe(([years, students, z1, d3, a1]) => {
          this.showForm = true;
          this.academicYear = years['data'].find(
            (year: AcademicYear) => year.isActive
          );
          this.students = students;
          this.a1 = { ...a1?.data } as A1;
          this.optionalSubjects = z1.data;
          this.d3Dropdown = d3.data;
          this.initializeOptionalSubjects();
          this.choosenStudent = `${this.a1.studentIdentifier}-${this.a1.studentFirstName}-${this.a1.studentFatherName}-${this.a1.studentLastName}`;
          this.cd.detectChanges();
        });
    }
  }

  initializeOptionalSubjects() {
    if (this.a1.subjectZ1A1Id) {
      this.subjectsChoosen.push({
        key: this.a1.subjectZ1A1Id,
        value: this.a1.subjectZ1A1Name,
      });
    }
    if (this.a1.subjectZ2A1Id) {
      this.subjectsChoosen.push({
        key: this.a1.subjectZ2A1Id,
        value: this.a1.subjectZ2A1Name,
      });
    }
    if (this.a1.subjectZ3A1Id) {
      this.subjectsChoosen.push({
        key: this.a1.subjectZ3A1Id,
        value: this.a1.subjectZ3A1Name,
      });
    }
  }

  ngOnChanges() {}

  openDialog() {
    this.ref = this.dialogService.open(ManageStudentsGridsDialogComponent, {
      width: '70%',
      position: 'center',
      contentStyle: { overflow: 'auto' },
      maximizable: true,
      closable: true,
      data: {
        students: this.students?.data,
        config: this.studentsConfig,
        totalRecords: this.students?.total,
      },
    });
    this.ref.onClose.pipe(untilDestroyed(this)).subscribe(data => {
      console.log(data);
      if (data) {
        this.choosenStudent = `${data.student.studentId}-${data.student.firstName}-${data.student.middleName}-${data.student.lastName}`;
        this.a1.studentId = data.student.id;
        this.cd.detectChanges();
      }
    });
  }
  onCancelClick() {
    this.router.navigate(['/applications/a1']);
  }
  getA1ById(): Observable<any> {
    return this.a1ApiService.getById(this.id!!).pipe(untilDestroyed(this));
  }
  getOptionalSubjects(): Observable<any> {
    return this.examSubjectsService.forExamType(Z1).pipe(untilDestroyed(this));
  }
  getD3Subjects(): Observable<any> {
    return this.examSubjectsService.forExamType(D3).pipe(untilDestroyed(this));
  }
  getAcademicYears(): Observable<any> {
    return this.academicYearService
      .getAcademicYears()
      .pipe(untilDestroyed(this));
  }
  getStudent(): Observable<any> {
    this.studentsConfig.filters = INITIAL_FILTER;
    return this.studentsApiService
      .loadStudents(this.studentsConfig)
      .pipe(untilDestroyed(this));
  }
  onDeleteClick(index: number) {
    this.moreSubjectThanAllowed = false;
    this.subjectsChoosen.splice(index, 1);
  }
  onSubmit() {
    console.log(this.a1);
    this.submitted = true;
    if (this.form.valid) {
      if (this.id) {
        this.updateA1(this.a1);
      } else {
        this.addA1(this.a1);
      }
    }
  }
  addSubject() {
    console.log(this.subjectsChoosen);
    this.moreSubjectThanAllowed = false;
    let subjectIndexFound = this.subjectsChoosen.findIndex(
      subject => subject.key === this.optionalSubjectChoosen.key
    );
    if (subjectIndexFound !== -1) {
      this.toastService.showError('Lënda është zgjedhur');
      debugger;
      return;
    }
    if (
      this.optionalSubjectChoosen === null ||
      this.optionalSubjectChoosen === ''
    ) {
      debugger;
      return;
    }
    if (this.subjectsChoosen.length === 2) {
      this.moreSubjectThanAllowed = true;
      debugger;
      return;
    }
    this.subjectsChoosen.push(this.optionalSubjectChoosen);
    if (this.subjectsChoosen.length > 1) {
      this.a1.subjectZ1A1Id = this.subjectsChoosen[0].key;
      this.a1.subjectZ2A1Id = this.subjectsChoosen[1].key;
    } else {
      this.a1.subjectZ1A1Id = this.subjectsChoosen[0].key;
    }
    this.optionalSubjectChoosen = '';
  }

  addA1(a1: A1) {
    this.a1ApiService
      .save(a1)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          if (response.isSuccessful) {
            this.toastService.showSuccess('Formulari A1 u shtua me sukses!');
          }
          if (response.isBadRequest)
            this.toastService.showError(
              'Ndodhi një problem gjatë ndryshimit të formularit A1!'
            );
        },
        error: err => {},
      });
  }

  updateA1(a1: A1) {
    let that = this;
    this.a1ApiService
      .update(a1)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data: any) => {
          if (data.isSuccessful) {
            that.toastService.showSuccess('Formulari A1 u ndryshua me sukses!');
          } else {
            data.errorMessage
              ? that.toastService.showError(data.errorMessage)
              : that.toastService.showError(
                  'Ndodhi një problem gjatë ndryshimit të formularit A1!'
                );
          }
          if (data.isBadRequest) {
            data.errorMessage
              ? that.toastService.showError(data.errorMessage)
              : that.toastService.showError(
                  'Ndodhi një problem gjatë ndryshimit të formularit A1!'
                );
          }
        },
      });
    error: (error: any) => {
      console.log(error);
      error.errorMessage
        ? this.toastService.showError(error.errorMessage)
        : this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të formularit A1!'
          );
      this.toastService.showError(
        'Ndodhi një problem gjatë ndryshimit të formularit A1!'
      );
    };
  }
}
