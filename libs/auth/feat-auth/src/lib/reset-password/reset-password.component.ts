import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthFacade } from '@msh/auth/data-access-auth';
import { StorageService } from '@msh/shared/data-access-shared';
import { UserResetPasswordModel } from '@msh/shared/domain-models';
import { MatchPasswordDirective } from '@msh/shared/util-shared';
import { UserResetPasswordApiService } from '@msh/user-section/data-access-user-section';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'msh-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    PasswordModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    CheckboxModule,
    AvatarModule,
    MessageModule,
    MatchPasswordDirective,
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent {
  @ViewChild('f') resetPasswordForm!: NgForm;
  userName: string | null = null;
  error$ = this.authFacade.error$;
  user$ = this.authFacade.user$;
  passwordNotMatch = false;
  passwordResetModel: UserResetPasswordModel = {
    password: '',
    newPassword: '',
    confirmPassword: '',
  };

  constructor(
    readonly authFacade: AuthFacade,
    private resetPasswordService: UserResetPasswordApiService,
    private storageService: StorageService
  ) {}

  onLoginSubmit(): void {
    if (!this.resetPasswordForm.valid) {
      return;
    }
    const name = (this.storageService.getItem('user') as any).username;
    const password = this.passwordResetModel.newPassword;

    this.resetPasswordService
      .userChangePassword(this.passwordResetModel)
      .subscribe(data => {
        localStorage.clear();
        this.authFacade.login({
          userName: name,
          password,
        } as any);
      });
  }
}
