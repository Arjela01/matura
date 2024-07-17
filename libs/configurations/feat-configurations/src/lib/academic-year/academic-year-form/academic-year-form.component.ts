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
import { AcademicYear } from '@msh/shared/domain-models';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'msh-academic-year-form',
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
  templateUrl: './academic-year-form.component.html',
  styleUrls: ['./academic-year-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcademicYearFormComponent {
  @Input() set academicYearDetails(details: AcademicYear | null) {
    if (details) {
      this.academicYear = Object.assign({}, details);
    }
  }

  @Output() formSave = new EventEmitter<AcademicYear>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  submitted = false;

  academicYear: AcademicYear = {
    id: 0,
    year: '',
    isFall: false,
    isActive: true
  };

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.academicYear);
    }
  }
}
