import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { AvatarModule } from 'primeng/avatar';
import { MessageModule } from 'primeng/message';
import { HttpClient } from '@angular/common/http';
import { environment } from '@msh/shared/environments';
import { AuthFacade } from '@msh/auth/data-access-auth';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'msh-external-login',
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
    ProgressSpinnerModule,
    ProgressBarModule,
  ],
  templateUrl: './external-login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalLoginComponent implements OnInit {
  showError = false;
  errorMessage = 'Ndodhi një gabim gjatë identifikimit';
  showSpinner = true;
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private authfacade: AuthFacade,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id_token = this.route.snapshot.queryParamMap.get('id_token');
    this.http
      .get<any>(
        `${environment.api_url}/AuthExternal/Login?id_token=${id_token}`
      )
      .subscribe(loginResponse => {
        if (loginResponse.isSuccessful) {
          this.authfacade.externalLogin(loginResponse);
        } else {
          this.showSpinner = false;
          this.errorMessage = loginResponse.errorMessage;
          this.showError = true;
          this.cd.detectChanges();
        }
      });
  }
}
