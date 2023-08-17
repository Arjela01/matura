import { CommonModule, formatDate } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Student, StudentBan } from '@msh/shared/domain-models';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { GRID_ACTIONS, GridEvent } from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject } from 'rxjs';
import { StudentsApiService } from '@msh/configurations/data-access-configurations';
import { SharedStudentLookupModule } from '@msh/shared/student-lookup';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';

@UntilDestroy()
@Component({
  selector: 'msh-student-ban-form',
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
    DialogModule,
    SharedStudentLookupModule,
    CalendarModule,
  ],
  templateUrl: './student-ban-form.component.html',
  styleUrls: ['./student-ban-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentBanFormComponent implements OnInit, DoCheck {
  private studentList$$ = new BehaviorSubject<Student[]>([]);
  studentList$ = this.studentList$$.asObservable();
  totalRecords = 0;

  selectedStudent: any = null;
  displayStudentModal = false;
  studentInputData = '';

  effectiveDate: any;
  banRemovalDate: any;
  filters: TableLazyLoadEvent | null = null;

  @Input() set bannedStudentsDetails(details: StudentBan | null) {
    if (details) {
      this.studentBan = Object.assign({}, details);
      if (details.effectiveDate && details.banRemovalDate) {
        this.effectiveDate = new Date(details.effectiveDate);
        this.banRemovalDate = new Date(details.banRemovalDate);
      }
    }
  }

  @Output() formSave = new EventEmitter<StudentBan>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  submitted = false;
  studentBan: StudentBan = {
    id: 0,
    studentId: '',
    studentIdentifier: '',
    studentInputData: '',
    studentName: '',
    description: '',
    isBanned: 0,
    effectiveDate: new Date(),
    banRemovalDate: new Date(),
  };

  constructor(
    private cd: ChangeDetectorRef,
    private readonly studentService: StudentsApiService
  ) {}

  onCancelClick() {
    this.formClose.emit();
  }
  onNewClick() {
    this.displayStudentModal = true;
    this.cd.markForCheck();
  }
  onModalClose() {
    this.displayStudentModal = false;
  }

  setStudent(student: any) {
    if (!student) {
      this.studentInputData = '';
    } else {
      this.studentBan.studentId = student.studentId;
      this.studentBan.studentIdentifier = student.studentIdentifier;
      this.studentInputData = `${student?.studentName}`;
    }
  }
  onStudentChange(student: Student) {
    if (!student) {
      this.studentBan.studentInputData = ' ';
    } else {
      this.studentBan.studentId = student.id;
      // eslint-disable-next-line max-len
      this.studentInputData = `${student?.studentId}-${student?.firstName}-${student?.middleName}-${student?.lastName}`;
    }
  }

  ngOnInit(): void {
    if (this.selectedStudent) {
      this.onStudentChange(this.selectedStudent);
    }
  }

  onGridEvent(event: GridEvent<Student | Student[]>) {
    switch (event.action) {
      case GRID_ACTIONS.EDIT:
        this.selectedStudent = Object.assign({}, event.data);
        this.setStudent(this.selectedStudent);
        this.displayStudentModal = false;
        break;
    }
  }
  ngDoCheck(): void {
    if (this.studentBan.studentId !== undefined) {
      this.studentBan.studentIdentifier = this.selectedStudent?.studentId;
      this.setStudent(this.studentBan);
    }
    if (this.selectedStudent !== null) {
      this.onStudentChange(this.selectedStudent);
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
        this.cd.detectChanges();
      });
  }

  onSubmit() {
    if (this.form.valid) {
      if (this.effectiveDate && this.banRemovalDate) {
        const formattedEffectiveDate = formatDate(
          this.effectiveDate,
          'yyyy-MM-dd',
          'en-US'
        );
        this.studentBan.effectiveDate = formattedEffectiveDate as any;
        const formattedBanRemovalDate = formatDate(
          this.banRemovalDate,
          'yyyy-MM-dd',
          'en-US'
        );
        this.studentBan.banRemovalDate = formattedBanRemovalDate as any;
      }
      this.formSave.emit(this.studentBan);
    }
    this.cd.markForCheck();
  }
}
