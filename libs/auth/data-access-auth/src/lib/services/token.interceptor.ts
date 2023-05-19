import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '@msh/shared/data-access-shared';
import { Observable, first, switchMap } from 'rxjs';
import { AuthFacade } from '../+state';

export const TOKEN_STORAGE_KEY = 'token';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private readonly storageService: StorageService,
    private auth: AuthFacade
  ) {}
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return this.auth.token$.pipe(
      first(),
      switchMap(token => {
        const authReq = token
          ? request.clone({
              setHeaders: { Authorization: 'Bearer ' + token },
            })
          : request;
        return next.handle(authReq);
      })
    );
  }
}
