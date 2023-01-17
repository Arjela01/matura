import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
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
import { roleList, rolesDropDown } from './role-list';

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
export class UserFormComponent implements OnChanges, OnInit {
  @Input() cities: DropdownModel<number>[] = [];
  @Input() administrationOffices: DropdownModel<number>[] = [];
  @Input() universityDepartments: DropdownModel<number>[] = [];
  @Input() highSchools: DropdownModel<number>[] = [];
  @Input() studyPrograms: DropdownModel<number>[] = [];
  @Input() universities: DropdownModel<number>[] = [];
  roles: DropdownModel<number>[] = [];

  showUniversity = false;
  showUniversityDepartment = false;
  showStudent = false;
  showStudyProgram = false;
  showAdministrationOffice = false;
  showHighSchools = false;
  showOverseerCode = false;

  universityDepartmentsFiltered: DropdownModel<number>[] = [];

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
    id: '',
    displayName: '',
    administrationOfficeId: 0,
    fileName: '',
    lastName: '',
    password: '',
    userName: '',
    lastPasswordChange: new Date(),
    name: '',
    isActive: true,
    overseerCode: '',
    studentId: null,
    roleId: '',
    studyProgramId: 0,
    universityId: 0,
    universityDepartmentId: 0,
  };

  constructor(private cd: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.onRoleRemoved();
    this.roles = rolesDropDown;
  }

  ngOnChanges(): void {
    this.onUniversityChange({ value: this.user.universityId });
    this.onRoleChange({ value: this.user.roleId });
  }

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.user);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUniversityChange($event: any) {
    this.universityDepartmentsFiltered = this.universityDepartments.filter(
      x => x.parentKey == $event.value
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRoleChange($event: any) {
    this.showUniversity = roleList.filter(
      x => x.roleCode === $event.value
    )[0]?.showUniversities;

    this.showUniversityDepartment = roleList.filter(
      x => x.roleCode === $event.value
    )[0]?.showUniversityDepartment;

    this.showAdministrationOffice = roleList.filter(
      x => x.roleCode === $event.value
    )[0]?.showAdministrationOffice;

    this.showStudyProgram = roleList.filter(
      x => x.roleCode === $event.value
    )[0]?.showStudyProgram;

    this.showHighSchools = roleList.filter(
      x => x.roleCode === $event.value
    )[0]?.showHighSchools;

    this.showOverseerCode = roleList.filter(
      x => x.roleCode === $event.value
    )[0]?.showOverseerCode;

    if (!this.user.roleId) {
      this.onRoleRemoved();
    }
  }

  onRoleRemoved() {
    this.showUniversity = false;
    this.showUniversityDepartment = false;
    this.showStudent = false;
    this.showStudyProgram = false;
    this.showAdministrationOffice = false;
    this.showHighSchools = false;
    this.showOverseerCode = false;
  }
}
