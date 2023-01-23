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
import { A1 } from '@msh/applications/domain-application';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'a1-form',
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
  templateUrl: './a1-form.component.html',
  styleUrls: ['./a1-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class A1FormComponent {
  testType = 'A1';
  d3SubjectChoosen = '';
  @Input() d3Dropdown: any = [];
  @Input() set a1Details(details: A1 | null) {
    if (details) {
      this.a1 = Object.assign({}, details);
    }
  }

  @Output() formSave = new EventEmitter<A1>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  submitted = false;

  a1: A1 = {
    id: '',
    academicYear: new Date().getFullYear(),
    studentFirstName: '',
    studentLastName: '',
    studentFatherName: '',
    studentIdentifier: '',
    studentOldIdentifier: '',
    isA1: true,
    nid: '',
    isApplyingToForeignCountries: false,
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private cd: ChangeDetectorRef) {
    console.log(this.d3Dropdown);
  }

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.a1);
    }
  }
}
