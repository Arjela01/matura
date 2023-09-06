import { CommonModule } from '@angular/common';
import {ChangeDetectionStrategy, Component, SecurityContext, ViewChild} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthFacade, LoginRequest } from '@msh/auth/data-access-auth';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import {environment} from "@msh/shared/environments";
import {DomSanitizer} from "@angular/platform-browser";

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
    username: '',
    password: '',
  };

  ealbania_sso_url;

  constructor(readonly authFacade: AuthFacade,
              private readonly domSanitizer: DomSanitizer) {
    this.ealbania_sso_url = this.domSanitizer.sanitize(SecurityContext.URL, environment.ealbania_sso_url);
  }

  onLoginSubmit(): void {
    if (!this.loginForm.valid) {
      return;
    }

    this.authFacade.login(Object.assign({}, this.loginFormModel));
  }

  protected readonly environment = environment;
}
