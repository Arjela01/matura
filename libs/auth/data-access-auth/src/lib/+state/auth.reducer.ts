import { GenericStoreStatus } from '@msh/shared/data-access-shared';
import { Action, createFeature, createReducer, on } from '@ngrx/store';
import { User } from '../models/user.model';
import { AuthActions } from './auth.actions';

export const AUTH_FEATURE_KEY = 'auth';

export interface AuthState {
  status: GenericStoreStatus;
  error: string | null;
  isAuthenticated: boolean;
  user: User;
  token: string;
}

export const initialAuthState: AuthState = {
  status: 'initial',
  error: null,
  isAuthenticated: false,
  user: {
    displayName: '',
    username: '',
  },
  token: '',
};

export const authFeature = createFeature({
  name: AUTH_FEATURE_KEY,
  reducer: createReducer(
    initialAuthState,
    on(AuthActions.initAuth, state => ({
      ...state,
      status: 'pending',
    })),
    on(AuthActions.loadAuthSuccess, (state, { token, user }) => ({
      ...state,
      status: 'success',
      isAuthenticated: true,
      token: token,
      user: user,
    })),
    on(AuthActions.login, state => ({
      ...state,
      status: 'loading',
      error: '',
    })),
    on(AuthActions.loginSuccess, (state, { loginResponse }) => ({
      ...state,
      status: 'success',
      error: null,
      isAuthenticated: true,
      user: {
        displayName: loginResponse.displayName,
        username: loginResponse.username,
      },
      token: loginResponse.token,
    })),
    on(AuthActions.loginFailure, (state, { error }) => ({
      ...state,
      status: 'error',
      error: error.message,
    })),
    on(AuthActions.logout, state => ({
      ...state,
      status: 'success',
      error: null,
      isAuthenticated: false,
      user: {
        displayName: '',
        username: '',
      },
      token: '',
    }))
  ),
});

const reducer = createReducer(initialAuthState);

export function authReducer(state: AuthState | undefined, action: Action) {
  return reducer(state, action);
}
