import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { A1ApiService } from '@msh/applications/data-access-applications';
import { A1Z } from '@msh/applications/domain-application';
import { AuthFacade } from '@msh/auth/data-access-auth';
import {
  AcademicYearApiService,
  ExamSubjectApiService,
  ExamTypeApiService,
  ReportsApiService,
  StudentsApiService,
} from '@msh/configurations/data-access-configurations';
import { ApiResult, DropdownModel } from '@msh/shared/data-access-shared';
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
  GRID_ACTIONS,
  GlobalToastService,
  GridEvent,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  of,
  switchMap,
} from 'rxjs';
import { A1FormModeEnum, ApplicationFormType } from '../a1-form-mode.enum';

@UntilDestroy()
@Component({
  selector: 'msh-a1-form',
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
    DialogModule,
    SharedStudentLookupModule,
  ],
  templateUrl: './a1-form.component.html',
  styleUrls: ['./a1-form.component.scss'],
  providers: [DialogService],
})
@UntilDestroy()
export class A1FormComponent {
  @Input()
  mode?: A1FormModeEnum;

  @Input()
  id?: string;

  @Input()
  studentId?: string;

  protected readonly A1FormModeEnum = A1FormModeEnum;
  showStudentModal = false;

  studentInputData: string | null = null;
  academicYear?: AcademicYear | null = null;
  optionalSubjects: DropdownModel<number>[] = [];
  d3Dropdown: DropdownModel<number>[] = [];
  @ViewChild('form', { static: false }) form!: NgForm;
  totalStudentRecords = 0;
  showStudentSearchButton = true;
  selectedStudent?: SharedStudent;
  applicationTypeA1 = ApplicationFormType.A1;
  disabled = false;

  @HostListener('window:popstate', ['$event'])
  onPopState() {
    this.ref?.destroy();
  }

  ref?: DynamicDialogRef;
  submitted = false;
  a1: A1Z = {
    isApplyingToForeignCountries: false,
  };
  private studentList$$ = new BehaviorSubject<Student[]>([]);
  studentList$ = this.studentList$$.asObservable();
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
    private authFacade: AuthFacade,
    private reportsApiService: ReportsApiService,
    private examTypeService: ExamTypeApiService
  ) {}

  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe();

  event = {
    first: 0,
    rows: 10,
    sortOrder: 1,
    filters: {},
    globalFilter: null,
  };

  ngOnInit() {
    this.showStudentSearchButton = A1FormModeEnum.Add === this.mode;

    if (A1FormModeEnum.Add === this.mode) {
      this.initWithAddMode();
    } else if (A1FormModeEnum.AddWithStudent === this.mode) {
      this.initWithAddWithStudentMode();
    } else if (
      A1FormModeEnum.Edit === this.mode ||
      A1FormModeEnum.EditWithStudent === this.mode
    ) {
      this.initWithEditMode();
    }
    this.cd.detectChanges();
  }

  onCancelClick() {
    this.router.navigate(['/applications/students']);
  }

  private initWithEditMode() {
    this.a1ApiService
      .getById(this.id!)
      .pipe(untilDestroyed(this))
      .pipe(
        switchMap((a1: ApiResult<A1Z>) => {
          this.a1 = { ...a1?.data } as A1Z;

          return this.studentsApiService.getById(a1.data.studentId);
        }),
        switchMap((student: ApiResult<Student>) => {
          this.selectedStudent = student.data;

          return combineLatest([
            this.getAcademicYears(),
            this.getOptionalSubjects(),
            this.getD3Subjects(),
          ]);
        })
      )
      .subscribe(([years, z1, d3]) => {
        this.academicYear = years['data'].find(
          (year: AcademicYear) => year.isActive
        );
        this.studentInputData = [
          this.a1.studentNid,
          this.a1.studentFirstName,
          this.a1.studentMiddleName,
          this.a1.studentLastName,
        ].join('-');
        this.d3Dropdown = d3.data;
        this.optionalSubjects = z1.data;
        this.cd.detectChanges();

        this.a1.subjectD3Id = String(this.a1.subjectD3Id);
        this.cd.detectChanges();
      });
  }

  private initWithAddWithStudentMode() {
    this.getStudentById(this.studentId!)
      .pipe(
        switchMap((student: ApiResult<Student>) => {
          this.a1.studentId = student.data.id;
          this.a1.studentIdentifier = student.data.studentId;
          this.a1.studentFirstName = student.data.firstName;
          this.a1.studentMiddleName = student.data.middleName;
          this.a1.studentLastName = student.data.lastName;
          this.selectedStudent = student.data;
          return combineLatest([
            this.getAcademicYears(),
            this.getOptionalSubjects(),
            this.getD3Subjects(),
          ]);
        })
      )
      .subscribe(([years, z1, d3]) => {
        this.academicYear = years['data'].find(
          (year: AcademicYear) => year.isActive
        );
        this.a1.academicYearId = this.academicYear?.id;
        this.d3Dropdown = d3.data;
        this.optionalSubjects = z1.data;
        this.studentInputData = [
          this.a1.studentIdentifier,
          this.a1.studentFirstName,
          this.a1.studentMiddleName,
          this.a1.studentLastName,
        ].join('-');
        this.cd.detectChanges();
      });
  }

  private initWithAddMode() {
    this.getAcademicYears()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.academicYear = response['data'].find(
          (year: AcademicYear) => year.isActive
        );
        this.a1.academicYearId = this.academicYear?.id;
        this.cd.detectChanges();
      });
  }

  private getStudentById(id: string): Observable<any> {
    return this.studentsApiService.getById(id).pipe(untilDestroyed(this));
  }

  private getOptionalSubjects(): Observable<any> {
    return this.examTypeService.loadDropdownList().pipe(
      switchMap(types => {
        const z1 = types.data.find(x => x.value == EXAM_TYPES.Z1);
        return this.examSubjectsService
          .forExamType(
            z1?.key ?? undefined,
            undefined,
            undefined,
            this.selectedStudent?.profileId,
            undefined,
            this.applicationTypeA1
          )
          .pipe(untilDestroyed(this));
      })
    );
  }

  private getD3Subjects(): Observable<any> {
    return this.examTypeService.loadDropdownList().pipe(
      switchMap(types => {
        const d3 = types.data.find(x => x.value == EXAM_TYPES.D3);

        if (d3) {
          return this.examSubjectsService.forExamType(
            d3.key ?? undefined,
            undefined,
            undefined,
            this.selectedStudent?.profileId,
            undefined,
            this.applicationTypeA1
          );
        } else {
          return of([]);
        }
      })
    );
  }

  private getAcademicYears(): Observable<any> {
    return this.academicYearService
      .getAcademicYears()
      .pipe(untilDestroyed(this));
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      if (
        A1FormModeEnum.Edit === this.mode ||
        A1FormModeEnum.EditWithStudent === this.mode
      ) {
        this.updateA1(this.a1);
      } else if (
        A1FormModeEnum.Add === this.mode ||
        A1FormModeEnum.AddWithStudent === this.mode
      ) {
        this.addA1(this.a1);
      } else {
        alert('Form mode cannot be determined');
      }
    }
  }

  addA1(a1: A1Z) {
    this.disabled = true;
    this.a1ApiService
      .save(a1)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: response => {
          if (response.isSuccessful) {
            this.toastService.showSuccess('Formulari A1 u shtua me sukses!');
            this.printConfirmation(response.data);
          } else {
            this.enableSaveButton();
            response.errorMessage
              ? this.toastService.showError(response.errorMessage)
              : this.toastService.showError(
                  'Ndodhi një problem gjatë ndryshimit të formularit A1!'
                );
          }
          if (response.isBadRequest) {
            this.enableSaveButton();
            this.toastService.showError(
              'Ndodhi një problem gjatë ndryshimit të formularit A1!'
            );
          }
        },
        error: error => {
          this.enableSaveButton();
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
    this.disabled = true;
    this.a1ApiService
      .update(a1)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: data => {
          if (data.isSuccessful) {
            this.toastService.showSuccess('Formulari A1 u ndryshua me sukses!');
            this.printConfirmation(data.data);
          } else {
            this.enableSaveButton();
            data.errorMessage
              ? this.toastService.showError(data.errorMessage)
              : this.toastService.showError(
                  'Ndodhi një problem gjatë ndryshimit të formularit A1!'
                );
          }
          if (data.isBadRequest) {
            this.enableSaveButton();
            data.errorMessage
              ? this.toastService.showError(data.errorMessage)
              : this.toastService.showError(
                  'Ndodhi një problem gjatë ndryshimit të formularit A1!'
                );
          }
        },
        error: (error: any) => {
          this.enableSaveButton();
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

  private enableSaveButton() {
    this.disabled = false;
    this.cd.detectChanges();
  }

  private printConfirmation(a1: A1Z) {
    this.reportsApiService
      .loadRoleReports(this.event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        const a1ReportData = response.data.find(item => {
          return item.reportId === Report.A1Form_Report;
        });

        const query: { queryParams: { [x: string]: string } } = {
          queryParams: {},
        };
        if (
          this.mode === A1FormModeEnum.Add ||
          this.mode === A1FormModeEnum.Edit
        )
          query.queryParams['returnUrl'] = '/applications/a1';
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
        this.router
          .navigate(
            [`/reports/a1-view/${a1.id}/${Report.A1Form_Report}`],
            query
          )
          .then();
      });
  }

  editStudent(): void {
    this.router
      .navigate([`/applications/students/edit/${this.a1.studentId}`])
      .then();
  }

  onStudentHide() {
    this.showStudentModal = false;
  }

  onGridEvent(event: GridEvent<SharedStudent | SharedStudent[]>) {
    switch (event.action) {
      case GRID_ACTIONS.EDIT:
        this.setSelectedStudent(Object.assign({}, event.data as Student));
        combineLatest([
          this.getOptionalSubjects(),
          this.getD3Subjects(),
        ]).subscribe(([z1, d3]) => {
          this.d3Dropdown = d3.data;
          this.optionalSubjects = z1.data;
          this.cd.detectChanges();
        });
        this.showStudentModal = false;
        break;
    }
  }

  setSelectedStudent(student: any) {
    this.selectedStudent = student;

    if (!student) {
      this.studentInputData = ' ';
    } else {
      this.a1.studentId = student.studentId;
      this.studentInputData =
        student?.studentId +
        '-' +
        (student?.firstName ?? student?.studentFirstName) +
        '-' +
        (student?.lastName ?? student?.studentLastName);
    }
    this.cd.detectChanges();
  }

  getStudents($event: TableLazyLoadEvent): void {
    this.studentsApiService
      .loadStudentsForA1A1Z($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.studentList$$.next(response.data);
        this.totalStudentRecords = response.total;
      });
  }
}
