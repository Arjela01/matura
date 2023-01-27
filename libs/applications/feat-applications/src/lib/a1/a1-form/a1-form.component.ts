import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
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

const D1 = 25;
const D2 = 2;
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
    subjectD3Id: '',
    isApplyingToForeignCountries: false,
    alreadyHaveDiploma: false,
    subjectD1Id: '',
    subjectD2Id: '',
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

  ngOnInit() {
    this.initializeFormWithApiCalls();
  }

  initializeFormWithApiCalls() {
    let apiCalls = [
      this.getAcademicYears(),
      this.getStudent(),
      this.getD3Subjects(),
      this.getOptionalSubjectsD1(),
    ];
    combineLatest(apiCalls)
      .pipe(untilDestroyed(this))
      .subscribe(([years, students, d3Subjects, d1Subjects]) => {
        this.showForm = true;
        this.academicYear = years['data'].find(
          (year: AcademicYear) => year.isActive
        );
        this.a1.academicYearId = this.academicYear?.id;
        this.students = students;
        this.d3Dropdown = d3Subjects.data;
        this.d1Dropdown = d1Subjects.data;
        this.cd.detectChanges();
      });
  }

  ngOnChanges() {}

  constructor(
    private cd: ChangeDetectorRef,
    private a1ApiService: A1ApiService,
    private toastService: GlobalToastService,
    private academicYearService: AcademicYearApiService,
    private studentsApiService: StudentsApiService,
    private examSubjectsService: ExamSubjectApiService,
    private dialogService: DialogService,
    private router: Router
  ) {}

  getD3Subjects(): Observable<any> {
    return this.examSubjectsService.fromExamType(D3);
  }
  getOptionalSubjectsD1() {
    return this.examSubjectsService.fromExamType(D1);
  }
  getOptionalSubjectsD2() {
    return this.examSubjectsService.fromExamType(D2);
  }
  openDialog() {
    this.ref = this.dialogService.open(ManageStudentsGridsDialogComponent, {
      width: '70%',
      position: 'center',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        students: this.students?.data,
        config: this.studentsConfig,
        totalRecords: this.students?.total,
      },
    });
    this.ref.onClose.subscribe(data => {
      console.log(data);
      if (data) {
        this.choosenStudent = `${data.student.studentId}-${data.student.firstName}-${data.student.middleName}-${data.student.lastName}`;
        this.a1.studentId = data.student.studentId;
        this.cd.detectChanges();
      }
    });
  }
  onCancelClick() {
    this.router.navigate(['/applications/a1']);
  }
  getAcademicYears(): Observable<any> {
    return this.academicYearService.getAcademicYears();
  }
  getStudent(): Observable<any> {
    this.studentsConfig.filters = INITIAL_FILTER;
    return this.studentsApiService.loadStudents(this.studentsConfig);
  }
  onDeleteClick(index: number) {
    this.moreSubjectThanAllowed = false;
    this.subjectsChoosen.splice(index, 1);
  }
  onSubmit() {
    console.log(this.a1);
    this.submitted = true;
    if (this.form.valid) {
      // this.formSave.emit(this.a1);
    }
  }
  addSubject() {
    this.moreSubjectThanAllowed = false;
    if (
      this.optionalSubjectChoosen === null ||
      this.optionalSubjectChoosen === ''
    ) {
      return;
    }
    if (this.subjectsChoosen.length === 2) {
      this.moreSubjectThanAllowed = true;
      return;
    }
    let subjectIndexFound = this.subjectsChoosen.findIndex(
      subject => subject.key === this.optionalSubjectChoosen.key
    );
    if (subjectIndexFound !== -1) {
      return;
    }
    this.subjectsChoosen.push(this.optionalSubjectChoosen);
    if (this.subjectsChoosen.length > 1) {
      this.a1.subjectD1Id = this.subjectsChoosen[0].key;
      this.a1.subjectD2Id = this.subjectsChoosen[1].key;
    } else {
      this.a1.subjectD1Id = this.subjectsChoosen[0].key;
    }
    this.optionalSubjectChoosen = '';
  }

  addA1(a1: A1) {
    this.a1ApiService
      .save(a1)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Formulari A1 u shtua me sukses!');
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të formularit A1!'
          );
      });
  }

  updateA1(a1: A1) {
    this.a1ApiService
      .update(a1)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Formulari A1 u ndryshua me sukses!');
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të formularit A1!'
          );
      });
  }
}
