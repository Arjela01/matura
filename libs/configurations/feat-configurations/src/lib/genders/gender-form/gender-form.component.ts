
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Gender } from '@msh/shared/domain-models';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
@Component({
  selector: 'msh-gender-form',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    RadioButtonModule,
    InputTextareaModule,
    ButtonModule,
    CheckboxModule,],
  templateUrl: './gender-form.component.html',
  styleUrls: ['./gender-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenderFormComponent {
  @Input() set genderDetails(details: Gender | null) {
    if (details) {
      this.gender = Object.assign({}, details);
    }
  }
  @Output() formSave = new EventEmitter<Gender>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  submitted = false;

  gender: Gender = {
    id: 0,
    name: ''
  };

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.gender);
    }
  }
}
