import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserApiService } from '@msh/configurations/data-access-configurations';
import { User } from '@msh/shared/domain-models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PasswordModule } from 'primeng/password';
import { StrongPasswordDirective } from '@msh/shared/util-shared';
import { DividerModule } from 'primeng/divider';

@UntilDestroy()
@Component({
  selector: 'msh-users-password-reset-form',
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
    StrongPasswordDirective,
    DividerModule,
  ],
  templateUrl: './users-password-reset-form.component.html',
  styleUrls: ['./users-password-reset-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersPasswordResetFormComponent implements OnInit, OnDestroy {
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
    userName: '',
    lastPasswordChange: new Date(),
    name: '',
    isActive: true,
    overseerCode: '',
    studentId: null,
    roleId: '',
    nid: '',
    studyProgramId: 0,
    confirmPassword: '',
    resetPassword: '',
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
    this.getUserPassword();
  }

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit(): void {
    this.user = { ...this.user };
    this.submitted = true;
    if (this.user.resetPassword === this.user.confirmPassword) {
      this.formSave.emit(this.user);
    }
  }

  getUserPassword() {
    if (this.user.id) {
      this.userService
        .getUserById(this.user.id)
        .pipe(untilDestroyed(this))
        .subscribe(response => {
          if (response.isSuccessful) {
            this.user = response.data;
          }
          this.cd.detectChanges();
        });
    }
  }
}
