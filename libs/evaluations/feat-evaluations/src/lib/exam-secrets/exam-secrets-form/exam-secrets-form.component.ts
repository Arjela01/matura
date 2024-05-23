import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  EventEmitter,
  Input,
  Output,
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
import { GRID_ACTIONS, GridEvent } from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { StudentsApiService } from '@msh/configurations/data-access-configurations';
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
})
export class ExamSecretsFormComponent implements DoCheck {
  private studentList$$ = new BehaviorSubject<Student[]>([]);
  studentList$ = this.studentList$$.asObservable();

  @Input() set examSecretDetails(details: ExamSecret | null) {
    if (details) {
      this.examSecret = Object.assign({}, details);
    }
  }
  @Input() examSubjects: DropdownModel<string>[] = [];
  @Input() examSecretNotes: DropdownModel<string>[] = [];
  @Input() examTypes: DropdownModel<number>[] = [];
  @Input() administrationOffices: DropdownModel<number>[] = [];
  @Input() examSites: DropdownModel<string>[] = [];
  @Input() examDates: DropdownModel<number>[] = [];

  @Output() formSave = new EventEmitter<ExamSecret>();
  @Output() formClose = new EventEmitter<undefined>();
  @Output() examTypeChanged = new EventEmitter<any>();
  @Output() examSiteChanged = new EventEmitter<any>();
  @Output() administrationOfficeChanged = new EventEmitter<number>();

  @ViewChild('form', { static: true }) form!: NgForm;

  filters: TableLazyLoadEvent | null = null;
  totalRecords = 0;
  submitted = false;
  studentInputData = '';
  showStudentModal = false;
  selectedStudent: any = null;
  examSecret: ExamSecret = {};

  constructor(
    private readonly studentService: StudentsApiService,
    private readonly cd: ChangeDetectorRef
  ) {}
  ngDoCheck(): void {
    if (this.examSecret.studentId !== undefined) {
      this.onStudentInit(this.examSecret);
    }
    if (this.selectedStudent !== null) {
      this.onStudentChange(this.selectedStudent);
    }
  }

  onExamTypeChanged($event: any): void {
    const ids = {
      examTypeId: $event.value,
      examSiteId: this.examSecret.examSiteId,
    };
    this.examTypeChanged.emit(ids);
  }

  onAdmOfficeChanged($event: any): void {
    this.administrationOfficeChanged.emit($event.value);
  }

  onExamSiteChanged($event: any): void {
    this.examSiteChanged.emit($event.value);
    this.cd.markForCheck();
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
        student?.studentStudentId +
        '-' +
        student?.studentFirstName +
        '-' +
        student.studentLastName;
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
