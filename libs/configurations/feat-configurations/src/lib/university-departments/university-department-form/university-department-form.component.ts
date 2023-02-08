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
import {
  UniversityDepartment,
} from '@msh/shared/domain-models';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import {DropdownModel} from "@msh/shared/data-access-shared";

@Component({
  selector: 'msh-university-department-form',
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
  templateUrl: './university-department-form.component.html',
  styleUrls: ['./university-department-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UniversityDepartmentFormComponent {
  @Input() set universityDepartmentDetails(
    details: UniversityDepartment | null
  ) {
    if (details) {
      this.universityDepartment = Object.assign({}, details);
    }
  }

  @Input() universities: DropdownModel<number>[] = [];

  @Output() formSave = new EventEmitter<UniversityDepartment>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  submitted = false;

  universityDepartment: UniversityDepartment = {
    universityId: 0,
    universityName: '',
    id: '',
    name: '',
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.universityDepartment);
    }
  }
}
