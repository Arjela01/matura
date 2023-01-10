import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, NgForm} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {InputNumberModule} from "primeng/inputnumber";
import {RadioButtonModule} from "primeng/radiobutton";
import {InputTextareaModule} from "primeng/inputtextarea";
import {ButtonModule} from "primeng/button";
import {CheckboxModule} from "primeng/checkbox";
import {ExamSubject} from "@msh/configurations/domain-configurations";

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
   ],
  templateUrl: './exam-subject-form.component.html',
  styleUrls: ['./exam-subject-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamSubjectFormComponent {

  @Input() set examSubjectDetails(details: ExamSubject | null) {
    if (details) {
      this.examSubject = Object.assign({}, details);
    }
  }
  @Output() formSave = new EventEmitter<ExamSubject>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;


  submitted = false;

  examSubject: ExamSubject = {
    id: '',
    name: '',
    code: '',
    credits: 0,
    isOptional: false,
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private cd: ChangeDetectorRef) {}

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.examSubject);
    }
  }

}
