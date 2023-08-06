import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  EventEmitter,
  Input,
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
import { DropdownModel } from '@msh/shared/data-access-shared';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BehaviorSubject } from 'rxjs';
import { ExamSecret, Student } from '@msh/shared/domain-models';
import {
  GlobalToastService,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import {
  ExamSubjectApiService,
  ExamTypeApiService,
  StudentsApiService,
} from '@msh/configurations/data-access-configurations';
import { Router } from '@angular/router';
import { SharedStudentLookupModule } from '@msh/shared/student-lookup';
import { TooltipModule } from 'primeng/tooltip';
import { TableLazyLoadEvent } from 'primeng/table';

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
    TooltipModule,
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
  @Input() examSubjects: DropdownModel<string>[] = [];
  @Input() examTypes: DropdownModel<number>[] = [];
  @Output() examTypeChanged = new EventEmitter<string>();

  filters: TableLazyLoadEvent | null = null;

  private studentList$$ = new BehaviorSubject<Student[]>([]);
  studentList$ = this.studentList$$.asObservable();
  totalRecords = 0;

  submitted = false;
  studentInputData = '';
  showStudentModal = false;
  selectedStudent: any = null;
  examSubjectId: any;
  examTypeId: any;

  examSecret: ExamSecret = {
    id: '',
    studentId: '',
    studentName: '',
    examSubjectName: '',
    examTypeName: '',
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
    this.examTypeId = this.examSecret.examTypeId;
    this.examSubjectId = this.examSecret.examSubjectId;
    this.cd.detectChanges();
  }

  constructor(
    private cd: ChangeDetectorRef,
    private readonly studentService: StudentsApiService,
    private readonly router: Router,
    private readonly toastService: GlobalToastService,
    private readonly examSubjectService: ExamSubjectApiService,
    private readonly examTypeService: ExamTypeApiService
  ) {}

  ngDoCheck(): void {
    if (this.examSecret.studentId !== undefined) {
      this.onStudentInit(this.examSecret);
    }
    if (this.selectedStudent !== null) {
      this.onStudentChange(this.selectedStudent);
    }
  }

  ngOnInit(): void {
    this.examTypeService.loadDropdownList().subscribe(response => {
      this.examTypes = response.data;
    });
  }
  onExamTypeChanged($event: any): void {
    this.examTypeId = $event.value;
    this.examTypeChanged.emit(this.examTypeId);
    this.examSecret.examTypeId = this.examTypeId;
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
      this.studentInputData =
        student?.studentIdentifier + '-' + student?.studentName;
    }
  }

  onStudentChange(student: Student) {
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
    this.examSecret.isFall = student.isFall;
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

  getStudents($event: TableLazyLoadEvent): void {
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
