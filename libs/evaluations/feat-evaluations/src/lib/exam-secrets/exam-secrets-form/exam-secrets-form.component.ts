import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  EventEmitter,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { ExamSecret } from '@msh/evaluations/domain-evaluations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BehaviorSubject } from 'rxjs';
import { Student } from '@msh/configurations/domain-configurations';
import {
  GlobalToastService,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import {
  AcademicYearApiService,
  ExamVersionApiService,
  StudentsApiService,
} from '@msh/configurations/data-access-configurations';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamSecretApiService } from '@msh/evaluations/data-access-evaluations';
import { A1zStudentSearchComponent } from '../../../../../../applications/feat-applications/src/lib/a1z/a1z-student-search/a1z-student-search.component';

@UntilDestroy()
@Component({
  selector: 'msh-exam-secret-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    RadioButtonModule,
    InputTextareaModule,
    ButtonModule,
    DropdownModule,
    AutoCompleteModule,
    DialogModule,
    A1zStudentSearchComponent,
  ],
  providers: [ConfirmationService],

  templateUrl: './exam-secrets-form.component.html',
  styleUrls: ['./exam-secrets-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamSecretsFormComponent implements OnInit, OnChanges, DoCheck {
  @Output() examVersionChanged = new EventEmitter<string>();

  @ViewChild('form', { static: true }) form!: NgForm;
  academicYears: DropdownModel<number>[] = [];
  examVersions: DropdownModel<number>[] = [];

  filters: LazyLoadEvent | null = null;

  private studentList$$ = new BehaviorSubject<Student[]>([]);
  studentList$ = this.studentList$$.asObservable();
  totalRecords = 0;

  submitted = false;
  studentInputData = '';
  showStudentModal = false;
  selectedStudent: any = null;
  examVersionId: any;
  formId: any;

  examSecret: ExamSecret = {
    id: '',
    studentId: '',
    studentName: '',
    examVersionId: '',
    examVersionName: '',
    academicYearId: 0,
    academicYear: '',
    barcode: '',
    isFall: true,
  };

  ngOnChanges(changes: SimpleChanges): void {
    this.examVersionId = this.examSecret.examVersionId;
    this.cd.detectChanges();
  }

  constructor(
    private cd: ChangeDetectorRef,
    private readonly studentService: StudentsApiService,
    private readonly router: Router,
    private examSecretApiService: ExamSecretApiService,
    private readonly toastService: GlobalToastService,
    private readonly academicYearService: AcademicYearApiService,
    private readonly examVersionService: ExamVersionApiService,
    private readonly activatedRoute: ActivatedRoute
  ) {
    this.formId = this.activatedRoute.snapshot.paramMap.get('id');
  }

  onExamVersionChanged($event: any): void {
    console.log('changed');
    this.examVersionChanged.emit(this.examVersionId);
  }

  ngDoCheck(): void {
    if (this.examSecret.studentId !== undefined) {
      this.onStudentInit(this.examSecret);
    }
    if (this.selectedStudent !== null) {
      this.onStudentChange(this.selectedStudent);
    }
  }

  ngOnInit(): void {
    this.academicYearService.loadDropdownList().subscribe(response => {
      this.academicYears = response.data;
    });
    this.examVersionService.loadDropdownList().subscribe(response => {
      this.examVersions = response.data;
    });
    this.examSecretApiService
      .getExamSecret(this.formId!)
      .subscribe(response => {
        this.examSecret = response.data;
        this.cd.detectChanges();
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
      this.examSecret.studentInputData = ' ';
    } else {
      this.examSecret.studentId = student.studentId;
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
      this.examSecret.studentInputData = ' ';
    } else {
      this.examSecret.studentId = student.id;
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

  onStudentShow() {
    this.showStudentModal = true;
  }

  onStudentHide() {
    this.showStudentModal = false;
  }

  onExitForm() {
    this.router.navigate(['/evaluations/exam-secret']);
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.valid) {
      if (-this.examSecret.id === 0) {
        this.onAddFormSubmit();
      } else {
        this.onEditFormSubmit();
      }
    }
  }

  onAddFormSubmit() {
    this.examSecretApiService
      .save(this.examSecret)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Sekretimi u shtua me sukses!');
          this.router.navigate(['evaluations/exam-secret']);
          console.log(response);
        }
        if (!response.isSuccessful) {
          this.toastService.showError(
            'Ndodhi një problem gjatë shtimit të sekretimit!'
          );
          console.log(response);
        }
      });
  }

  onEditFormSubmit() {
    this.examSecretApiService
      .update(this.examSecret)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Sekretimi u ndryshua me sukses!');
          this.router.navigate(['evaluations/exam-secret']);
          console.log(response);
        }
        if (!response.isSuccessful) {
          this.toastService.showError(
            'Ndodhi një problem gjatë shtimit të sekretimit!'
          );
          console.log(response);
        }
      });
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
}
