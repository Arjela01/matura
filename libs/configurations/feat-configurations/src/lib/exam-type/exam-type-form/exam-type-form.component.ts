import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, NgForm} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {InputNumberModule} from "primeng/inputnumber";
import {RadioButtonModule} from "primeng/radiobutton";
import {InputTextareaModule} from "primeng/inputtextarea";
import {ButtonModule} from "primeng/button";
import {CheckboxModule} from "primeng/checkbox";
import {ExamType} from "@msh/shared/domain-models";

@Component({
  selector: 'msh-exam-type-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    RadioButtonModule,
    InputTextareaModule,
    ButtonModule,
    CheckboxModule,],
  templateUrl: './exam-type-form.component.html',
  styleUrls: ['./exam-type-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamTypeFormComponent {
  @Input() set examTypeDetails(details: ExamType | null) {
    if (details) {
      this.examType = Object.assign({}, details);
    }
  }

  @Output() formSave = new EventEmitter<ExamType>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', {static: true}) form!: NgForm;

  submitted = false;

  examType: ExamType = {
    id: '',
    name: '',
    maximumValueWritingScore: 0,
    maximumValueMultipleScore: 0,
  };

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.examType);
    }
  }
}
