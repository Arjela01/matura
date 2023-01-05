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
import { HighSchool } from '@msh/configurations/domain-configurations';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'msh-high-school-form',
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
  templateUrl: './high-school-form.component.html',
  styleUrls: ['./high-school-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HighSchoolFormComponent {
  @Input() set highSchoolDetails(details: HighSchool | null) {
    if (details) {
      this.highSchool = Object.assign({}, details);
    }
  }
  @Output() formSave = new EventEmitter<HighSchool>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  submitted = false;

  highSchool: HighSchool = {
    id: 0,
    code: '',
    name: '',
    isPublic: true,
    administrationOfficeName: '',
    cityName: '',
    regionName: '',
  };

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.highSchool);
    }
  }
}
