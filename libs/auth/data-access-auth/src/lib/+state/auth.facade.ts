import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { LoginRequest } from '../models/login-request.model';
import { AuthActions } from './auth.actions';
import { authQuery } from './auth.selectors';
@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly store = inject(Store);

  isLoading$ = this.store.select(authQuery.selectIsLoading);
  error$ = this.store.select(authQuery.selectError);
  isAuthenticated$ = this.store.select(authQuery.selectIsAuthenticated);
  user$ = this.store.select(authQuery.selectUser);
  token$ = this.store.select(authQuery.selectToken);

  init() {
    this.store.dispatch(AuthActions.initAuth());
  }

  login(loginRequest: LoginRequest) {
    this.store.dispatch(AuthActions.login({ loginRequest }));
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
