import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {A1Z, A1ZTableRecord, CarriedGrade} from '@msh/applications/domain-application';
import { DropdownModel } from '@msh/shared/data-access-shared';
import {
  SharedStudent,
  SharedStudentLookupModule,
} from '@msh/shared/student-lookup';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'msh-carried-grade-form',
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
    FileUploadModule,
    DialogModule,
    SharedStudentLookupModule,
  ],
  templateUrl: './carried-grade-form.component.html',
  styleUrls: ['./carried-grade-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarriedGradesFormComponent implements OnChanges {
  @Input() gradeDetails?: CarriedGrade;
  @Input() academicYearDropdown: DropdownModel<number>[] = [];
  @Input() examTypeDropdown: DropdownModel<number>[] = [];
  @Input() a1ZSelectedExamType: any;
  @Input() a1zformId: any
  @Input() examSubjectDropdown: DropdownModel<string>[] = [];
  @Input() selectedStudent?: SharedStudent;

  @Output() examTypeChanged = new EventEmitter<{
    academicYearId?: number;
  }>();

  @Output() openStudentModal = new EventEmitter();

  @Output() formSave = new EventEmitter<CarriedGrade>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  submitted = false;

  grade: CarriedGrade = {
    id: 0,
    examTypeId: 0,
    grade: 0,
    year: 0,
    examTypeName: '',
    document: '',
  };

  uploaded = false;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  showStudentSearchButton = true;
  studentInputData = '';
   a1z: A1Z={
     subjectD1Name: '',
     scoreD1 : 0,
   };
  examTypeId: any;
  forms: A1ZTableRecord[] = [];

  constructor(private cd: ChangeDetectorRef,private route: ActivatedRoute) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.isObjectEmpty(this.gradeDetails)) {
      this.showStudentSearchButton = false;
    }
    if (changes['selectedStudent']) {
      if (changes['selectedStudent'].currentValue) {
        const student = changes['selectedStudent']
          .currentValue as SharedStudent;
        this.grade.studentId = student.id;
        this.studentInputData =
          student?.idCard +
          '-' +
          (student?.firstName ?? student?.firstName) +
          '-' +
          (student?.lastName ?? student?.lastName);
      } else {
        this.studentInputData = ' ';
      }
    }
    if (changes['gradeDetails'] && changes['gradeDetails'].currentValue) {
      const g = changes['gradeDetails'].currentValue;
      this.grade = g;
      if (g.studentNid) {
        this.studentInputData = [
          g.studentNid,
          g.studentFirstName,
          g.studentMiddleName,
          g.studentLastName,
        ].join('-');
      } else {
        this.studentInputData = '';
      }
    }
  }

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.grade);
    }
  }

  selectFiles(event: { files: File[] }) {
    const fileReader = new FileReader();
    for (const file of event.files) {
      fileReader.readAsDataURL(file);
      this.uploaded = true;
      fileReader.onload = () => {
        if (fileReader.result) {
          const parts = fileReader.result.toString().split(';base64,');
          this.grade.document = parts[1] as string;
        }
      };
    }
  }

  examTypeChangedLocally() {
    this.examTypeChanged.emit({
      academicYearId: this.grade.academicYearId,
    });
  }

  clearFile() {
    this.grade.document = undefined;
  }

  isObjectEmpty(object: any) {
    for (const key in object) {
      return false;
    }
    return true;
  }


  isDropdownDisabled(): boolean {
    const currentUrl = window.location.pathname;
    this.grade.examTypeId = this.a1ZSelectedExamType?.key;
    this.grade.examTypeName = this.a1ZSelectedExamType?.value;
    this.cd.markForCheck();
    return (

      currentUrl === `/applications/a1z/for-student/${this.selectedStudent?.id}/add` ||
      currentUrl === `/applications/a1z/edit/${this.a1zformId}`
    );

  }

}
