import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  ACADEMIC_YEAR_KEY,
  AcademicYearApiService,
} from '@msh/configurations/data-access-configurations';
import { StorageService } from '@msh/shared/data-access-shared';
import { AcademicYear, roleKey } from '@msh/shared/domain-models';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import jwt_decode from 'jwt-decode';
import { catchError, exhaustMap, map, of, switchMap, tap } from 'rxjs';
import { USER_STORAGE_KEY, User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { HeartbeatService } from '../services/heartbeat.service';
import { TOKEN_STORAGE_KEY } from '../services/token.interceptor';
import { AuthActions } from './auth.actions';
@Injectable()
export class AuthEffects {
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.initAuth),
      map(() => {
        const token = this.storageService.getItem(TOKEN_STORAGE_KEY) as string;
        const user = this.storageService.getItem(USER_STORAGE_KEY) as User;
        const academicYear = this.storageService.getItem(
          ACADEMIC_YEAR_KEY
        ) as AcademicYear;
        if (token && user && user?.username && user?.displayName) {
          const tokenStore: any = jwt_decode(token as string);
          if (!tokenStore.NeedResetPassword) {
            this.heartBeatService.startTime();
          }
          return AuthActions.loadAuthSuccess({
            token: token,
            user: user,
            academicYear,
          });
        }
        return AuthActions.nothing();
      }),
      catchError(() => of(AuthActions.logout()))
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(action =>
        this.authService.login(action.loginRequest).pipe(
          map(loginResponse => {
            if (loginResponse.isSuccessful)
              return AuthActions.loginSuccess({ loginResponse });

            return AuthActions.loginFailure({
              error: new Error(
                loginResponse.errorMessage ?? 'Përdorues/fjalëkalim i gabuar.'
              ),
            });
          }),
          catchError((error: HttpErrorResponse) => {
            //TODO: This can be handled better if better API response
            if (
              error.error &&
              error.error.includes &&
              error.error.includes('username')
            ) {
              return of(
                AuthActions.loginFailure({
                  error: new Error('Përdorues/fjalëkalim i gabuar.'),
                })
              );
            }

            return of(
              AuthActions.loginFailure({
                error: new Error('Diçka shkoi keq. Ju lutem provoni përsëri!'),
              })
            );
          })
        )
      )
    )
  );

  externalLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.externalLogin),
      exhaustMap(action => {
        return this.commonLoginSuccess(action);
      }))
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      exhaustMap(action => {
        return this.commonLoginSuccess(action);
      })
    )
  );

   commonLoginSuccess= (action: any) => {
    const user = {
      displayName: action.loginResponse.displayName,
      username: action.loginResponse.username,
    } as User;
    this.storageService.setItem(USER_STORAGE_KEY, user);
    this.storageService.setItem(
      TOKEN_STORAGE_KEY,
      action.loginResponse.token
    );
    const token: any = jwt_decode(action.loginResponse.token as string);
    if (token.NeedResetPassword) {
      return of(AuthActions.passwordChange());
    }

    return this.academicYearService.getAcademicYears().pipe(
      map((years: any) => years.data.find((year: any) => year.isActive)),
      switchMap(activeYear => {
        if (!token.NeedResetPassword) {
          this.heartBeatService.startTime();
        }
        if (token[roleKey] !== 'Admin') {
          return of(
            AuthActions.initAcademicYear({
              academicYear: { id: 0, year: '' },
            })
          );
        }
        return of(
          AuthActions.initAcademicYear({
            academicYear: activeYear,
          })
        );
      })
    );
  }

  initialiseAcademicYear$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.initAcademicYear),
        map(action => {
          if (action.academicYear) {
            this.storageService.setItem(ACADEMIC_YEAR_KEY, action.academicYear);
            this.router.navigate(['/']);
          } else {
            this.router.navigate(['/']);
          }
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.storageService.removeItem(TOKEN_STORAGE_KEY);
          this.storageService.removeItem(USER_STORAGE_KEY);
          this.storageService.removeItem(ACADEMIC_YEAR_KEY);
          this.heartBeatService.stopTimer();
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );

  changeAcademicYear$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.changeAcademicYear),
        tap(action => {
          this.storageService.setItem(ACADEMIC_YEAR_KEY, action.academicYear);
        })
      ),
    { dispatch: false }
  );

  passwordChange$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.passwordChange),
        tap(action => {
          this.router.navigate(['/reset-password']);
        })
      ),
    { dispatch: false }
  );

  resetToken$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.resetToken),
        tap(action => {
          this.storageService.removeItem(TOKEN_STORAGE_KEY);
          this.heartBeatService.stopTimer();
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private heartBeatService: HeartbeatService,
    private academicYearService: AcademicYearApiService
  ) {}
}
