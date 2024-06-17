import { inject, Injectable } from '@angular/core';
import { AcademicYear } from '@msh/shared/domain-models';
import { Store } from '@ngrx/store';
import { LoginRequest } from '../models/login-request.model';
import { AuthActions } from './auth.actions';
import { authQuery } from './auth.selectors';
import { LoginResponse } from '../models/login-response.model';
@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly store = inject(Store);

  isLoading$ = this.store.select(authQuery.selectIsLoading);
  error$ = this.store.select(authQuery.selectError);
  isAuthenticated$ = this.store.select(authQuery.selectIsAuthenticated);
  user$ = this.store.select(authQuery.selectUser);
  token$ = this.store.select(authQuery.selectToken);
  academicYear$ = this.store.select(authQuery.selectAcademicYear);

  init() {
    this.store.dispatch(AuthActions.initAuth());
  }

  login(loginRequest: LoginRequest) {
    this.store.dispatch(AuthActions.login({ loginRequest }));
  }

  externalLogin(loginResponse: LoginResponse) {
    this.store.dispatch(AuthActions.externalLogin({ loginResponse }));
  }

  changeAcademicYear(academicYear: Partial<AcademicYear>) {
    this.store.dispatch(AuthActions.changeAcademicYear({ academicYear }));
  }
  resetToken() {
    this.store.dispatch(AuthActions.resetToken());
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
