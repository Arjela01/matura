import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core';
import {FormsModule, NgForm, Validators} from '@angular/forms';
import { AcademicYear } from '@msh/configurations/domain-configurations';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import {GlobalToastService} from "@msh/shared/util-shared";
import { ValidatorFn } from '@angular/forms';

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
  private readonly toastService!: GlobalToastService;

  @Input() set academicYearDetails(details: AcademicYear | null) {
    if (details) {
      this.academicYear = Object.assign({}, details);
    }
  }

  @Output() formSave = new EventEmitter<AcademicYear>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', {static: true}) form!: NgForm;

  submitted = false;
  academicYearValue = 0;

  academicYear: AcademicYear = {
    id: '',
    year: '',
    isFall: true,
    isActive: true,
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private cd: ChangeDetectorRef) {
  }

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.academicYear);
    }
  }

  academicYearValidation() {
    this.academicYearValue = 0;
    if (this.academicYearValue <= 2000) {
      return ;
    }
  }

}
