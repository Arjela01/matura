import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserResetPasswordApiService } from '@msh/user-section/data-access-user-section';
import { UserResetPasswordModel } from '@msh/shared/domain-models';
import { NgForm } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import {
  GlobalToastService,
  StrongPasswordDirective,
} from '@msh/shared/util-shared';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'msh-user-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    PasswordModule,
    FormsModule,
    ButtonModule,
    StrongPasswordDirective,
    DividerModule,
  ],
  templateUrl: './user-reset-password.component.html',
  styleUrls: ['./user-reset-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserResetPasswordComponent {
  @Output() formSave = new EventEmitter<UserResetPasswordModel>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;
  submitted = false;
  displayPasswordModal = false;
  password: string | undefined;
  userResetPassword: UserResetPasswordModel = {
    children: [],
    confirmPassword: '',
    newPassword: '',
  };
  constructor(
    private userResetPasswordService: UserResetPasswordApiService,
    private toastService: GlobalToastService
  ) {}

  changeUserPassword(userResetPassword: UserResetPasswordModel) {
    this.userResetPasswordService
      .userChangePassword(userResetPassword)
      .subscribe(res => {
        if (res.isSuccessful) {
          this.toastService.showSuccess('Fjalëkalimi u ndryshua me sukses');
          this.displayPasswordModal = false;
        } else this.toastService.showError(res.errorMessage);
        if (res.isBadRequest) {
          this.toastService.showError(
            'Ndodhi nje problem gjatë ndryshimit të fjalëkalimit'
          );
        }
      });
  }
  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.changeUserPassword(this.userResetPassword);
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.userResetPassword);
    }
  }
}
