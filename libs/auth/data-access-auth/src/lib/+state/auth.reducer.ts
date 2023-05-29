import { GenericStoreStatus } from '@msh/shared/data-access-shared';
import { AcademicYear } from '@msh/shared/domain-models';
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
  academicYear: Partial<AcademicYear>;
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
  academicYear: { id: 0, year: '' },
};

export const authFeature = createFeature({
  name: AUTH_FEATURE_KEY,
  reducer: createReducer(
    initialAuthState,
    on(AuthActions.initAuth, state => ({
      ...state,
      status: 'pending',
    })),
    on(AuthActions.loadAuthSuccess, (state, { token, user, academicYear }) => ({
      ...state,
      status: 'pending',
      isAuthenticated: true,
      token: token,
      user: user,
      academicYear: academicYear,
    })),

    on(AuthActions.login, state => ({
      ...state,
      status: 'loading',
      error: '',
    })),
    on(AuthActions.loginSuccess, (state, { loginResponse }) => ({
      ...state,
      status: 'loading',
      error: null,
      isAuthenticated: true,
      user: {
        displayName: loginResponse.displayName,
        username: loginResponse.username,
      },
      token: loginResponse.token,
    })),
    on(AuthActions.initAcademicYear, (state, { academicYear }) => ({
      ...state,
      status: 'success',
      error: null,
      isAuthenticated: true,
      academicYear: academicYear,
    })),
    on(AuthActions.changeAcademicYear, (state, { academicYear }) => ({
      ...state,
      status: 'success',
      error: null,
      isAuthenticated: true,
      academicYear: academicYear,
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
