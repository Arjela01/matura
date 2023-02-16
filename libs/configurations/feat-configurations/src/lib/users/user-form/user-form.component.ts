import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserApiService } from '@msh/configurations/data-access-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { User } from '@msh/shared/domain-models';
import {
  AlbanianNidValidatorDirective,
  StrongPasswordDirective,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { roleList } from './role-list';

@UntilDestroy()
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
    PasswordModule,
    AlbanianNidValidatorDirective,
    StrongPasswordDirective,
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent implements OnChanges, OnInit, OnDestroy {
  @Input() cities: DropdownModel<number>[] = [];
  @Input() administrationOffices: DropdownModel<number>[] = [];
  @Input() universityDepartments: DropdownModel<number>[] = [];
  @Input() highSchools: DropdownModel<number>[] = [];
  @Input() studyPrograms: DropdownModel<number>[] = [];
  @Input() universities: DropdownModel<number>[] = [];
  @Input() roles: DropdownModel<number>[] = [];

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

  submitted = false;

  user: User = {
    id: '',
    displayName: '',
    administrationOfficeId: 0,
    fileName: '',
    lastName: '',
    username: '',
    password: '',
    lastPasswordChange: new Date(),
    name: '',
    isActive: true,
    overseerCode: '',
    studentId: null,
    roleId: '',
    nid: '',
    studyProgramId: 0,
    universityId: 0,
    universityDepartmentId: 0,
  };

  constructor(
    private cd: ChangeDetectorRef,
    private readonly userService: UserApiService
  ) {}
  ngOnDestroy(): void {
    this.form.reset();
  }
  ngOnInit(): void {
    this.onRoleRemoved();
    this.getUser();
  }

  ngOnChanges(): void {
    this.onUniversityChange({ value: this.user.universityId });
    this.onRoleChange({ value: this.user?.roleId });
  }

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.user.nid = this.user.nid.toUpperCase();
      this.formSave.emit(this.user);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUniversityChange($event: any) {
    this.universityDepartmentsFiltered = this.universityDepartments.filter(
      x => x.parentKey == $event.value
    );
  }

  getUser() {
    if (this.user.id) {
      this.userService
        .getUserById(this.user.id)
        .pipe(untilDestroyed(this))
        .subscribe(response => {
          if (response.isSuccessful) {
            this.user = response.data;
            console.log(response.data);
          }
          this.cd.detectChanges();
        });
    }
  }

  onRoleChange($event: any): void {
    const knownRole = roleList.find(x => x.roleName === $event.value);

    if (knownRole == null) {
      this.showUniversity = false;
      this.showUniversityDepartment = false;
      this.showAdministrationOffice = false;
      this.showStudyProgram = false;
      this.showHighSchools = false;
      this.showOverseerCode = false;
    } else {
      this.showUniversity = knownRole.showUniversity;
      this.showUniversityDepartment = knownRole.showUniversityDepartment;
      this.showAdministrationOffice = knownRole.showAdministrationOffice;
      this.showStudyProgram = knownRole.showStudyProgram;
      this.showHighSchools = knownRole.showHighSchools;
      this.showOverseerCode = knownRole.showOverseerCode;
    }

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
