import { CommonModule, formatDate } from '@angular/common';
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
import { StudentBan } from '@msh/shared/domain-models';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'msh-student-ban-form',
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
  templateUrl: './student-ban-form.component.html',
  styleUrls: ['./student-ban-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentBanFormComponent {
  effectiveDate: any;
  banRemovalDate: any;

  @Input() set bannedStudentsDetails(details: StudentBan | null) {
    if (details) {
      this.studentBan = Object.assign({}, details);
      this.effectiveDate = formatDate(
        new Date(this.studentBan.effectiveDate),
        'dd/MM/yyyy',
        'en'
      );
      this.banRemovalDate = formatDate(
        new Date(this.studentBan.banRemovalDate),
        'dd/MM/yyyy',
        'en'
      );
    }
  }

  @Output() formSave = new EventEmitter<StudentBan>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  submitted = false;
  studentBan: StudentBan = {
    id: 0,
    studentId: '',
    studentIdentifier: '',
    studentName: '',
    description: '',
    isBanned: 0,
    effectiveDate: new Date(),
    banRemovalDate: new Date(),
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private cd: ChangeDetectorRef) {}

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.studentBan);
    }
  }
}
