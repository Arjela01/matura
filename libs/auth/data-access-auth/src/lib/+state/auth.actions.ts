import { AcademicYear } from '@msh/shared/domain-models';
import {
  createAction,
  createActionGroup,
  emptyProps,
  props,
} from '@ngrx/store';
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';
import { User } from '../models/user.model';

export const initAuth = createAction('[Auth Page] Init');

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Init Auth': emptyProps(),
    'Load Auth Success': props<{
      token: string;
      user: User;
      academicYear: Partial<AcademicYear>;
      isFall: boolean;
    }>(),
    Login: props<{ loginRequest: LoginRequest }>(),
    ExternalLogin: props<{ loginResponse: LoginResponse }>(),
    'Init Academic Year': props<{
      academicYear: Partial<AcademicYear>;
    }>(),
    'Change Academic Year': props<{ academicYear: Partial<AcademicYear> }>(),
    'Login Failure': props<{ error: Error }>(),
    'Login Success': props<{
      loginResponse: LoginResponse;
    }>(),
    passwordChange: emptyProps(),
    resetToken: emptyProps(),
    Logout: emptyProps(),
    Nothing: emptyProps(),
    'Init Fall': props<{
      isFall: boolean;
    }>(),
    'Change Fall': props<{ isFall: boolean }>(),
  },
});
