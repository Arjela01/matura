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
    }>(),
    Login: props<{ loginRequest: LoginRequest }>(),
    'Init Academic Year': props<{
      academicYear: Partial<AcademicYear>;
    }>(),
    'Change Academic Year': props<{ academicYear: Partial<AcademicYear> }>(),
    'Login Failure': props<{ error: Error }>(),
    'Login Success': props<{
      loginResponse: LoginResponse;
    }>(),
    Logout: emptyProps(),
  },
});
