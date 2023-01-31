import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
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
import { combineLatest, Observable, of, switchMap } from 'rxjs';
import { ManageStudentsGridsDialogComponent } from '../manage-students-grids-dialog/manage-students-grids-dialog.component';

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
  @HostListener('window:popstate', ['$event'])
  onPopState() {
    //close modal when clicking back button on google
    this.ref?.destroy();
  }
  ref?: DynamicDialogRef;
  submitted = false;
  a1: any = {
    id: '',
    academicYearId: '',
    studentId: '',
    isA1: true,
    isApplyingToForeignCountries: false,
    alreadyHaveDiploma: false,
    subjectD3Id: '',
    subjectZ1Id: '',
    subjectZ2Id: null,
    subjectZ3Id: null,
    overSeerCode: '',
  };
  studentsConfig = {
    first: 0,
    rows: 10,
    sortOrder: 1,
    filters: {},
    globalFilter: null,
  };
  showForm: boolean | null = null;
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
    const apiCalls = [
      this.getAcademicYears(),
      this.getStudent(),
      this.getOptionalSubjects(),
    ];
    if (!this.id) {
      combineLatest(apiCalls)
        .pipe(untilDestroyed(this))
        .subscribe(([years, students, z1]) => {
          this.showForm = true;
          this.academicYear = years['data'].find(
            (year: AcademicYear) => year.isActive
          );
          this.a1.academicYearId = this.academicYear?.id;
          this.students = students;
          this.optionalSubjects = z1.data;
          this.cd.detectChanges();
        });
    } else {
      this.getA1ById()
        .pipe(
          switchMap((a1: any) => {
            this.a1 = { ...a1?.data } as A1;
            apiCalls.push(this.getD3Subjects(this.a1.isFall));
            return combineLatest(apiCalls);
          })
        )
        .subscribe(([years, students, z1, d3]) => {
          this.academicYear = years['data'].find(
            (year: AcademicYear) => year.isActive
          );
          this.showForm = true;
          this.d3Dropdown = d3.data;
          this.a1.subjectD3Id = this.a1.subjectD3A1Id;
          this.students = students;
          this.optionalSubjects = z1.data;
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
        value: this.a1.subjectZ1Name,
      });
    }
    if (this.a1.subjectZ2A1Id) {
      this.subjectsChoosen.push({
        key: this.a1.subjectZ2A1Id,
        value: this.a1.subjectZ2Name,
      });
    }
  }

  initializeDialog() {
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
    this.ref.onClose
      .pipe(
        switchMap((data: any) => {
          this.d3Dropdown = [];
          this.subjectsChoosen = [];
          this.submitted = false;
          this.d3SubjectChoosen = '';
          if (data) {
            this.choosenStudent = `${data.student.studentId}-${data.student.firstName}-${data.student.middleName}-${data.student.lastName}`;
            this.a1.studentId = data.student.id;
            this.cd.detectChanges();
            return this.getD3Subjects(data.student.isFall);
          }
          return of([]);
        })
      )
      .subscribe((d3: any) => {
        this.d3Dropdown = d3?.data;
      });
  }

  onCancelClick() {
    this.router.navigate(['/applications/a1']);
  }

  getA1ById(): Observable<any> {
    return this.a1ApiService.getById(this.id!).pipe(untilDestroyed(this));
  }

  getOptionalSubjects(): Observable<any> {
    return this.examSubjectsService
      .forExamType(undefined, undefined, undefined, undefined, true)
      .pipe(untilDestroyed(this));
  }

  getD3Subjects(isFall: boolean, id?: string): Observable<any> {
    return this.examSubjectsService
      .forExamType(undefined, undefined, undefined, isFall, false)
      .pipe(untilDestroyed(this));
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
    if (this.subjectsChoosen.length === 1) {
      this.a1.subjectZ1Id = this.subjectsChoosen[0].key;
      this.a1.subjectZ2Id = null;
      this.a1.subjectZ2Name = null;
    }
  }

  onSubmit() {
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
    this.moreSubjectThanAllowed = false;
    const subjectIndexFound = this.subjectsChoosen.findIndex(
      subject => subject.key === this.optionalSubjectChoosen.key
    );
    if (subjectIndexFound !== -1) {
      this.toastService.showError('Lënda është zgjedhur');
      return;
    }
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
    this.subjectsChoosen.push(this.optionalSubjectChoosen);
    if (this.subjectsChoosen.length > 1) {
      this.a1.subjectZ1Id = this.subjectsChoosen[0].key;
      this.a1.subjectZ2Id = this.subjectsChoosen[1].key;
    } else {
      this.a1.subjectZ1Id = this.subjectsChoosen[0].key;
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
            this.router.navigate(['/applications/a1']);
          }
          if (response.isBadRequest)
            this.toastService.showError(
              'Ndodhi një problem gjatë ndryshimit të formularit A1!'
            );
        },
        error: error => {
          error.errorMessage
            ? this.toastService.showError(error.errorMessage)
            : this.toastService.showError(
                'Ndodhi një problem gjatë ndryshimit të formularit A1!'
              );
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të formularit A1!'
          );
        },
      });
  }

  updateA1(a1: A1) {
    this.a1ApiService
      .update(a1)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data: any) => {
          if (data.isSuccessful) {
            this.toastService.showSuccess('Formulari A1 u ndryshua me sukses!');
            this.router.navigate(['/applications/a1']);
          } else {
            data.errorMessage
              ? this.toastService.showError(data.errorMessage)
              : this.toastService.showError(
                  'Ndodhi një problem gjatë ndryshimit të formularit A1!'
                );
          }
          if (data.isBadRequest) {
            data.errorMessage
              ? this.toastService.showError(data.errorMessage)
              : this.toastService.showError(
                  'Ndodhi një problem gjatë ndryshimit të formularit A1!'
                );
          }
        },
        error: (error: any) => {
          error.errorMessage
            ? this.toastService.showError(error.errorMessage)
            : this.toastService.showError(
                'Ndodhi një problem gjatë ndryshimit të formularit A1!'
              );
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të formularit A1!'
          );
        },
      });
  }
}
