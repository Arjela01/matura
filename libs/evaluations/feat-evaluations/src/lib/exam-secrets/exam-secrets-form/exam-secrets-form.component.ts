import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  EventEmitter, Input,
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
import { ExamSecret} from '@msh/evaluations/domain-evaluations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BehaviorSubject } from 'rxjs';
import {ExamSubjectProfile, Student} from '@msh/shared/domain-models';
import {
  GlobalToastService,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import {

  ExamSubjectApiService,
  StudentsApiService,
} from '@msh/configurations/data-access-configurations';
import {  Router } from '@angular/router';
import { SharedStudentLookupModule } from '@msh/shared/student-lookup';

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
    SharedStudentLookupModule,
  ],
  providers: [ConfirmationService],

  templateUrl: './exam-secrets-form.component.html',
  styleUrls: ['./exam-secrets-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamSecretsFormComponent implements OnInit, OnChanges, DoCheck {

  @Output() formSave = new EventEmitter<ExamSecret>();
  @Output() formClose = new EventEmitter<undefined>();
  @ViewChild('form', { static: true }) form!: NgForm;
  @Input() examSubjects: DropdownModel<number>[] = [];
  filters: LazyLoadEvent | null = null;

  private studentList$$ = new BehaviorSubject<Student[]>([]);
  studentList$ = this.studentList$$.asObservable();
  totalRecords = 0;

  submitted = false;
  studentInputData = '';
  showStudentModal = false;
  selectedStudent: any = null;
  examSubjectId: any;

  examSecret: ExamSecret = {
    id: '',
    studentId: '',
    studentName: '',
    examSubjectName: '',
    barcode: '',
    isFall: true,
    academicYearId: 1,
  };
  @Input() set examSecretDetails(details: ExamSecret | null) {
    if (details) {
      this.examSecret = Object.assign({}, details);
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.examSubjectId = this.examSecret.examSubjectId;
    this.cd.detectChanges();
  }

  constructor(
    private cd: ChangeDetectorRef,
    private readonly studentService: StudentsApiService,
    private readonly router: Router,
    private readonly toastService: GlobalToastService,
    private readonly examSubjectService: ExamSubjectApiService,
  ) {
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
    this.examSubjectService.loadDropdownList().subscribe(response => {
      this.examSubjects = response.data;
    });
  }

  onGridEvent(event: GridEvent<Student | Student[]>) {
    switch (event.action) {
      case GRID_ACTIONS.EDIT:
        this.selectedStudent = Object.assign({}, event.data);
        this.showStudentModal = false;
        break;
    }
  }

  onStudentInit(student: any) {
    if (!student) {
      this.studentInputData = ' ';
    } else {
      this.examSecret.studentId = student.studentId;
      this.studentInputData = student?.studentId + '-' + student?.studentName;
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
    this.formClose.emit();
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.examSecret);
    }
  }


  getStudents($event: LazyLoadEvent): void {
    this.filters = Object.assign({}, $event);
    this.studentService
      .loadStudents($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.studentList$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

}
