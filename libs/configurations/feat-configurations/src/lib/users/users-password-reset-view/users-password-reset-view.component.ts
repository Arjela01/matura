import { ClipboardModule } from '@angular/cdk/clipboard';
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
import { StrongPasswordDirective } from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
@UntilDestroy()
@Component({
  selector: 'msh-users-password-reset-view',
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
    CardModule,
    ClipboardModule,
    RippleModule,
  ],
  templateUrl: './users-password-reset-view.component.html',
  styleUrls: ['./users-password-reset-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersPasswordResetViewComponent implements OnInit, OnDestroy {
  @Input() userDetails: any;
  @Output() formSave = new EventEmitter<User>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  submitted = false;

  user: User = {
    isDisabled: false,
    id: '',
    displayName: '',
    administrationOfficeId: 0,
    fileName: '',
    lastName: '',
    // firstName: '',
    username: '',
    password: '',
    lastPasswordChange: new Date(),
    name: '',
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
    this.getUserPassword();
  }

  onCancelClick() {
    this.formClose.emit();
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
