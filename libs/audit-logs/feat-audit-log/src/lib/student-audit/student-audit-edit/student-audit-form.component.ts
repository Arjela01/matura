import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CountryName, Student } from '@msh/shared/domain-models';
import {
  ALBANIAN_NID_REGEXP,
  UpperCaseInputDirective,
} from '@msh/shared/util-shared';

@Component({
  selector: 'msh-student-audit-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    UpperCaseInputDirective,
  ],
  templateUrl: './student-audit-form.component.html',
  styleUrls: ['./student-audit-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentAuditFormComponent {
  @ViewChild('form', { static: true }) form!: NgForm;
  @Input() set studentDetails(details: Student | null) {
    if (details) {
      this.student = Object.assign({}, details);
    }
  }
  @Output() formSave = new EventEmitter<Student>();
  @Output() formClose = new EventEmitter<undefined>();

  submitted = false;
  student: Student = <Student>{};
  validNid = true;

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.student);
    }
  }

  validateNID() {
    if (this.student.countryId === CountryName.Albania) {
      const value = this.student.idCard;
      this.validNid = new RegExp(ALBANIAN_NID_REGEXP).test(value as string);
    } else {
      this.validNid = true;
    }
  }
}
