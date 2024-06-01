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

import {
  BARCODE_REGEX,
  GRID_ACTIONS,
  GridEvent,
  UpperCaseInputDirective,
} from '@msh/shared/util-shared';
import { TableLazyLoadEvent } from 'primeng/table';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject } from 'rxjs';
import { StudentsApiService } from '@msh/configurations/data-access-configurations';
import { SharedStudentLookupModule } from '@msh/shared/student-lookup';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { TooltipModule } from 'primeng/tooltip';

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
    TooltipModule,
    UpperCaseInputDirective,
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
  filters: TableLazyLoadEvent | null = null;

  @Input() set bannedStudentsDetails(details: StudentBan | null) {
    if (details) {
      this.studentBan = Object.assign({}, details);
      if (details.effectiveDate) {
        this.effectiveDate = new Date(details.effectiveDate);
      }
    }
  }

  @Input() examTypes: DropdownModel<number>[] = [];

  @Output() formSave = new EventEmitter<StudentBan>();
  @Output() formClose = new EventEmitter<undefined>();
  @Output() clearSelectedStudent = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;
  barcodePattern = BARCODE_REGEX;

  submitted = false;
  studentBan: StudentBan = {
    id: 0,
    studentId: '',
    studentInputData: '',
    description: '',
    isBanned: 0,
    effectiveDate: new Date(),
    banRemovalDate: new Date(),
    barcode: '',
    examTypeId: 0,
    examTypeName: '',
    isFall: false,
  };

  constructor(
    private cd: ChangeDetectorRef,
    private readonly studentService: StudentsApiService
  ) {}

  onCancelClick() {
    this.formClose.emit();
  }

  clearStudent() {
    this.selectedStudent = null;
    this.clearSelectedStudent.emit();
    this.cd.detectChanges();
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
      this.studentBan.studentId = '';
    } else {
      this.studentBan.studentId = student.studentId;
      if (this.studentBan?.studentStudentId) {
        this.studentInputData = `${this.studentBan?.studentStudentId}-${this.studentBan?.studentFirstName}-${student?.studentLastName}-${student?.studentLastName}`;
      } else {
        this.studentInputData = '';
      }
    }
  }

  onStudentChange(student: Student) {
    if (!student) {
      this.studentBan.studentInputData = ' ';
    } else {
      this.studentBan.studentId = student.id;
      if (student?.studentId) {
        this.studentInputData = `${student?.studentId}-${student?.firstName}-${student?.middleName}-${student?.lastName}`;
      } else {
        this.studentBan.studentInputData = '';
      }
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
      if (this.effectiveDate) {
        const formattedEffectiveDate = formatDate(
          this.effectiveDate,
          'dd/MM/yyyy',
          'en'
        );
        this.studentBan.effectiveDate = formattedEffectiveDate as any;
      }
      this.formSave.emit(this.studentBan);
    }
    this.cd.markForCheck();
  }

  protected readonly BARCODE_REGEX = BARCODE_REGEX;
}
