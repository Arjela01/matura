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
import { ExamSubject } from '@msh/shared/domain-models';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'msh-exam-subject-form',
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
  ],
  templateUrl: './exam-subject-form.component.html',
  styleUrls: ['./exam-subject-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamSubjectFormComponent{
  @Input() examTypes: DropdownModel<number>[] = [];

  @Input() set examSubjectDetails(details: ExamSubject | null) {
    if (details) {
      this.examSubject = Object.assign({}, details);
    }
  }
  @Output() formSave = new EventEmitter<ExamSubject>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;
  selectedExamType!: string;


  submitted = false;

  examSubject: ExamSubject = {
    id: '',
    name: '',
    code: '',
    credits: 0,
    isOptional: false,
    academicYearId: 1,

  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private cd: ChangeDetectorRef) {}


  onCancelClick() {
    this.formClose.emit();
  }
  findExamTypeValue() {
    const selectedExamType
      = this.examTypes.find(type => type.key === this.examSubject.examTypeId);
    this.selectedExamType = selectedExamType?.value || '';
    this.examSubject.isOptional = selectedExamType?.value?.startsWith('Z') ?? false;
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.examSubject);
    }
  }

}
