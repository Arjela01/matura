import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FailingStudent } from '@msh/applications/domain-applications';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'msh-failing-students-form',
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
  templateUrl: './failing-students-form.component.html',
  styleUrls: ['./failing-students-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FailingStudentsFormComponent {
  @Input() set failingStudentDetails(details: FailingStudent | null) {
    if (details) {
      this.failingStudent = Object.assign({}, details);
    }
  }

  @Output() formSave = new EventEmitter<FailingStudent>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  submitted = false;

  failingStudent: FailingStudent = {
    id: 0,
    subject: undefined,
  };

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.failingStudent);
    }
  }
}
