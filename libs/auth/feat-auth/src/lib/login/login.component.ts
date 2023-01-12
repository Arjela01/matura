import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthFacade, LoginRequest } from '@msh/auth/data-access-auth';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'msh-login',
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
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  @ViewChild('f') loginForm!: NgForm;

  error$ = this.authFacade.error$;

  loginFormModel: LoginRequest = {
    userName: '',
    password: '',
  };

  constructor(readonly authFacade: AuthFacade) {}

  onLoginSubmit(): void {
    if (!this.loginForm.valid) {
      return;
    }

    this.authFacade.login(Object.assign({}, this.loginFormModel));
  }
}
