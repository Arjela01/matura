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
import { A1Z } from '@msh/applications/domain-application';
import {
  AcademicYearApiService,
  ExamSubjectApiService,
  ReportsApiService,
  StudentsApiService,
} from '@msh/configurations/data-access-configurations';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
import {
  AcademicYear,
  Student,
  StudentTableView,
} from '@msh/shared/domain-models';
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
import { Observable, combineLatest, of, switchMap } from 'rxjs';
import { Report } from '../../../../../../reports/reports-enum';
import { ManageStudentsGridsDialogComponent } from '../manage-students-grids-dialog/manage-students-grids-dialog.component';

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
  // moreSubjectThanAllowed = false;
  subjectsChoosen: any[] = [];
  choosenStudent: string | null = null;
  academicYear?: AcademicYear | null = null;
  optionalSubjects: DropdownModel<number>[] = [];
  d3Dropdown: DropdownModel<number>[] = [];
  d1Dropdown: DropdownModel<number>[] = [];
  d2Dropdown: DropdownModel<number>[] = [];
  @ViewChild('form', { static: false }) form!: NgForm;
  totalRecords = 0;
  parameterUrl!: any;
  parameterYear!: any;
  editing = false;
  showSearch = true;

  @HostListener('window:popstate', ['$event'])
  onPopState() {
    //close modal when clicking back button on google
    this.ref?.destroy();
  }
  ref?: DynamicDialogRef;
  submitted = false;
  a1: A1Z = {
    id: 0,
    academicYearId: 0,
    studentId: '',
    isA1: true,
    isApplyingToForeignCountries: false,
    alreadyHaveDiploma: false,
    subjectD3Id: '',
    subjectZ1Id: '',
    subjectZ2Id: undefined,
    overSeerCode: '',
  };
  studentsConfig = {
    first: 0,
    rows: 10,
    sortOrder: 1,
    filters: {},
    globalFilter: null,
  };

  students: StudentTableView | null = null;
  currentStudent: Student | null = null;
  id: string | null = null;
  studentId: string | null = null;
  formId: string | null;
  a1Report: Report = Report.A1Form_Report;

  constructor(
    private cd: ChangeDetectorRef,
    private a1ApiService: A1ApiService,
    private toastService: GlobalToastService,
    private academicYearService: AcademicYearApiService,
    private studentsApiService: StudentsApiService,
    private examSubjectsService: ExamSubjectApiService,
    private dialogService: DialogService,
    private router: Router,
    private route: ActivatedRoute,
    private reportsApiService: ReportsApiService
  ) {
    this.formId = this.route.snapshot.paramMap.get('id');
  }
  ngOnInit() {
    if (this.formId) {
      this.editing = true;
    }
    this.id = this.route.snapshot.params['id'];
    this.studentId = this.route.snapshot.params['student'];
    this.initializeFormWithApiCalls();

    this.reportsApiService
      .loadRoleReports(this.event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        const a1ReportData = response.data.find(item => {
          return item.reportId === 13;
        });
        const parametersArray = JSON.parse(a1ReportData?.parameters as never);
        if (parametersArray.length > 0)
          this.parameterUrl = parametersArray.find((item: string) => {
            return ['studentid'].includes(item.toLowerCase());
          });
        this.parameterYear = parametersArray.find((item: string) => {
          return ['academicyearid'].includes(item.toLowerCase());
        });
      });
  }
  event = {
    first: 0,
    rows: 10,
    sortOrder: 1,
    filters: {},
    globalFilter: null,
  };

  initializeFormWithApiCalls() {
    if (this.studentId != null) {
      this.showSearch = false;
    }
    if (this.studentId) {
      this.getStudentById(this.studentId)
        .pipe(
          switchMap((student: ApiResult<Student>) => {
            this.a1.studentId = student.data.id;
            this.a1.studentIdentifier = student.data.studentId;
            this.a1.firstName = student.data.firstName;
            this.a1.middleName = student.data.middleName;
            this.a1.lastName = student.data.lastName;
            return combineLatest([
              this.getAcademicYears(),
              this.getStudent(),
              this.getOptionalSubjects(),
              this.getD3Subjects(student.data.isFall),
            ]);
          })
        )
        .subscribe(([years, students, z1, d3]) => {
          this.academicYear = years['data'].find(
            (year: AcademicYear) => year.isActive
          );
          this.a1.academicYearId = this.academicYear?.id;
          this.d3Dropdown = d3.data;
          this.students = students;
          this.optionalSubjects = z1.data;
          this.initializeOptionalSubjects();
          this.choosenStudent = `${this.a1.studentIdentifier}-${this.a1.firstName}-${this.a1.middleName}-${this.a1.lastName}`;
          this.cd.detectChanges();
        });
    } else if (!this.id) {
      this.getAcademicYears()
        .pipe(
          switchMap((academicYears: any) => {
            this.academicYear = academicYears['data'].find(
              (year: AcademicYear) => year.isActive
            );
            return combineLatest([
              this.getStudent(),
              this.getOptionalSubjects(),
            ]);
          })
        )
        .subscribe(([students, z1]) => {
          this.a1.academicYearId = this.academicYear?.id;
          this.students = students;
          this.optionalSubjects = z1.data;
          this.cd.detectChanges();
        });
    } else {
      this.getA1ById()
        .pipe(
          switchMap((a1: ApiResult<A1Z>) => {
            this.a1 = { ...a1?.data } as A1Z;
            return this.studentsApiService.getById(a1.data.studentId);
          }),
          switchMap((student: ApiResult<Student>) => {
            this.currentStudent = student.data;

            return combineLatest([
              this.getAcademicYears(),
              this.getStudent(),
              this.getOptionalSubjects(),
              this.getD3Subjects(student.data.isFall ?? false),
            ]);
          })
        )
        .subscribe(([years, students, z1, d3]) => {
          this.academicYear = years['data'].find(
            (year: AcademicYear) => year.isActive
          );
          this.d3Dropdown = d3.data;
          this.students = students;
          this.optionalSubjects = z1.data;
          this.initializeOptionalSubjects();
          this.choosenStudent = `${this.a1.studentId}-${this.a1.firstName}-${this.a1.middleName}-${this.a1.lastName}`;
        });
    }
  }

  initializeOptionalSubjects() {
    if (this.a1.subjectZ1Id) {
      this.subjectsChoosen.push(
        this.optionalSubjects.find(x => x.key == (this.a1.subjectZ1Id as any))
      );
    }
    if (this.a1.subjectZ2Id) {
      this.subjectsChoosen.push(
        this.optionalSubjects.find(x => x.key == (this.a1.subjectZ2Id as any))
      );
    }
    this.cd.detectChanges();
  }

  getStudentById(id: string): Observable<any> {
    return this.studentsApiService.getById(id).pipe(untilDestroyed(this));
  }

  initializeDialog() {
    this.ref = this.dialogService.open(ManageStudentsGridsDialogComponent, {
      width: '80%',
      position: 'center',
      contentStyle: { overflow: 'auto' },
      maximizable: true,
      closable: true,
      header: 'Kërko Maturantin',
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

  getStudent(): Observable<StudentTableView> {
    return this.studentsApiService
      .loadStudents(this.studentsConfig)
      .pipe(untilDestroyed(this));
  }

  onDeleteClick(index: number) {
    // this.moreSubjectThanAllowed = false;
    this.subjectsChoosen.splice(index, 1);
    if (this.subjectsChoosen.length === 1) {
      this.a1.subjectZ1Id = this.subjectsChoosen[0].key;
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
    // this.moreSubjectThanAllowed = false;
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
      // this.moreSubjectThanAllowed = true;
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

  addA1(a1: A1Z) {
    this.a1ApiService
      .save(a1)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          if (response.isSuccessful) {
            this.toastService.showSuccess('Formulari A1 u shtua me sukses!');
            const query: { queryParams: { [x: string]: string } } = {
              queryParams: {},
            };
            if (
              this.parameterUrl &&
              this.parameterYear &&
              this.a1.studentId &&
              this.a1.academicYearId
            ) {
              query.queryParams[`${this.parameterUrl}`] = this.a1.studentId;
              query.queryParams[`${this.parameterYear}`] =
                this.a1.academicYearId.toString();
            }
            this.router.navigate([`/reports/${this.a1Report}`], query).then();
          } else {
            response.errorMessage
              ? this.toastService.showError(response.errorMessage)
              : this.toastService.showError(
                  'Ndodhi një problem gjatë ndryshimit të formularit A1!'
                );
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

  updateA1(a1: A1Z) {
    this.a1ApiService
      .update(a1)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data: any) => {
          if (data.isSuccessful) {
            this.toastService.showSuccess('Formulari A1 u ndryshua me sukses!');
            const extras: { queryParams: { [x: string]: string } } = {
              queryParams: {},
            };
            if (
              this.parameterUrl &&
              this.parameterYear &&
              this.a1.studentId &&
              this.a1.academicYearId
            ) {
              extras.queryParams[`${this.parameterUrl}`] = this.a1.studentId;
              extras.queryParams[`${this.parameterYear}`] =
                this.a1?.academicYearId.toString();
            }
            this.router.navigate([`/reports/${this.a1Report}`], extras).then();
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

  goBack(): void {
    this.router
      .navigate([`/configurations/student-edit/${this.a1.studentId}`])
      .then();
  }
}
