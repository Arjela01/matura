import { CommonModule } from '@angular/common';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { AvatarModule } from 'primeng/avatar';
import { MessageModule } from 'primeng/message';
import { HttpClient } from '@angular/common/http';
import { environment } from '@msh/shared/environments';
import {
  User,
  USER_STORAGE_KEY,
} from '../../../../data-access-auth/src/lib/models/user.model';
import {
  AuthActions,
  AuthFacade,
  HeartbeatService,
  TOKEN_STORAGE_KEY,
} from '@msh/auth/data-access-auth';
import jwt_decode from 'jwt-decode';
import { map, of, switchMap } from 'rxjs';
import { roleKey } from '@msh/shared/domain-models';
import { StorageService } from '@msh/shared/data-access-shared';
import { AcademicYearApiService } from '@msh/configurations/data-access-configurations';
import { untilDestroyed } from '@ngneat/until-destroy';
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {ProgressBarModule} from "primeng/progressbar";

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
  errorMessage = "Ndodhi një gabim gjatë identifikimit";
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
