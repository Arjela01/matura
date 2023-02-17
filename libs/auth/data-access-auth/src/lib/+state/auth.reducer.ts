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
  startedHeartBeat: boolean;
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
  startedHeartBeat: false,
};

export const authFeature = createFeature({
  name: AUTH_FEATURE_KEY,
  reducer: createReducer(
    initialAuthState,
    on(AuthActions.initAuth, state => ({
      ...state,
      status: 'pending',
      startedHeartBeat: false,
    })),
    on(AuthActions.loadAuthSuccess, (state, { token, user }) => ({
      ...state,
      status: 'success',
      isAuthenticated: true,
      token: token,
      user: user,
      startedHeartBeat: true,
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
      startedHeartBeat: true,
    })),
    on(AuthActions.loginFailure, (state, { error }) => ({
      ...state,
      status: 'error',
      error: error.message,
      startedHeartBeat: false,
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
      startedHeartBeat: false,
    }))
  ),
});

const reducer = createReducer(initialAuthState);

export function authReducer(state: AuthState | undefined, action: Action) {
  return reducer(state, action);
}
