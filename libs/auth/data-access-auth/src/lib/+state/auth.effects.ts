import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { StorageService } from '@msh/shared/data-access-shared';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, filter, map, of, switchMap, tap } from 'rxjs';
import { TOKEN_STORAGE_KEY } from '../services/token.interceptor';
import { User, USER_STORAGE_KEY } from './../models/user.model';
import { AuthService } from './../services/auth.service';
import { AuthActions } from './auth.actions';

@Injectable()
export class AuthEffects {
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.initAuth),
      map(() => {
        const token = this.storageService.getItem(TOKEN_STORAGE_KEY) as string;
        const user = this.storageService.getItem(USER_STORAGE_KEY) as User;

        if (token && user && user?.username && user?.displayName) {
          return AuthActions.loadAuthSuccess({ token: token, user: user });
        }

        return AuthActions.logout();
      })
    )
  );

  loadAuthSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loadAuthSuccess),
        switchMap(() =>
          this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            tap(e => {
              const url = (e as NavigationEnd).url;
              // if (url.includes('/login')) this.router.navigate(['/']);
              // this.router.navigate([url]);
            })
          )
        )
      ),
    {
      dispatch: false,
    }
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
              error: new Error('Përdorues/fjalëkalim i gabuar.'),
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

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(action => {
          const user = {
            displayName: action.loginResponse.displayName,
            username: action.loginResponse.username,
          } as User;

          this.storageService.setItem(USER_STORAGE_KEY, user);
          this.storageService.setItem(
            TOKEN_STORAGE_KEY,
            action.loginResponse.token
          );
          this.router.navigate(['/']);
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
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
}
