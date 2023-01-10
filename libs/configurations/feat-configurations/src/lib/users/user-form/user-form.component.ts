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
import { User } from '@msh/configurations/domain-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'msh-user-form',
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
    CalendarModule,
    DropdownModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent {
  @Input() cities: DropdownModel<number>[] = [];
  @Input() administrationOffices: DropdownModel<number>[] = [];
  @Input() universityDepartments: DropdownModel<number>[] = [];
  @Input() highSchools: DropdownModel<number>[] = [];
  @Input() studyPrograms: DropdownModel<number>[] = [];
  @Input() universities: DropdownModel<number>[] = [];

  @Input() set userDetails(details: User | null) {
    if (details) {
      this.user = Object.assign({}, details);
    }
  }
  @Output() formSave = new EventEmitter<User>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  citiesFiltered: DropdownModel<number>[] = [];

  submitted = false;

  user: User = {
    id: 0,
    displayName: '',
    administrationOffice: '',
    universityDepartment: '',
    fileName: '',
    highSchool: '',
    lastName: '',
    nodes: [],
    password: '',
    userName: '',
    lastPasswordChange: new Date(),
    name: '',
    overseerCode: '',
    studentId: null,
    studyProgramId: 0,
    universityId: 0,
    validFrom: undefined,
    validTo: undefined,
  };

  constructor(private cd: ChangeDetectorRef) {}

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.user);
    }
    //console.log(this.form.value);
  }
}
