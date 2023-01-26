import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { A1 } from '@msh/applications/domain-application';
import {
  AcademicYear,
  Student,
} from '@msh/configurations/domain-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';

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
})
export class A1FormComponent {
  testType = 'A1';
  d3SubjectChoosen = '';
  optionalSubjectChoosen: any = null;
  moreSubjectThanAllowed = false;
  subjectsChoosen: any[] = [];
  choosenStudent: string | null = null;
  @Input() d3Dropdown: DropdownModel<number>[] = [];
  @Input() optionalSubjects: DropdownModel<number>[] = [];
  @Input() students: any = [];
  @Input() academicYear: AcademicYear | null = null;
  @Input() selectedStudent: Student | null = null;

  @Input() set a1Details(details: A1 | null) {
    if (details) {
      this.a1 = Object.assign({}, details);
    }
  }

  @Output() formSave = new EventEmitter<A1>();
  @Output() formClose = new EventEmitter<undefined>();
  @Output() studentSearchOpen = new EventEmitter<undefined>();
  @ViewChild('form', { static: true }) form!: NgForm;

  submitted = false;
  a1: A1 = {
    id: '',
    academicYearId: this.academicYear?.id,
    studentId: '',
    isA1: true,
    subjectD3Id: '',
    isApplyingToForeignCountries: false,
    alreadyHaveDiploma: false,
    subjectD1Id: '',
    subjectD2Id: '',
    overSeerCode: '',
  };

  ngOnChanges() {
    if (this.selectedStudent) {
      this.choosenStudent = `${this.selectedStudent.studentId}-${this.selectedStudent.firstName}-${this.selectedStudent.middleName}-${this.selectedStudent.lastName}`;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private cd: ChangeDetectorRef) {
    console.log(this.optionalSubjects);
  }

  show() {
    this.studentSearchOpen.emit();
  }

  onCancelClick() {
    this.formClose.emit();
  }

  onDeleteClick(index: number) {
    this.moreSubjectThanAllowed = false;
    this.subjectsChoosen.splice(index, 1);
  }
  onSubmit() {
    this.submitted = true;
    this.a1.studentId = this.selectedStudent?.id;
    this.a1.academicYearId = this.academicYear?.id;
    console.log(this.a1);
    if (this.form.valid) {
      this.formSave.emit(this.a1);
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
}
