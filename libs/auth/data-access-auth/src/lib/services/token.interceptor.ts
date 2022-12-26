import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from '@msh/shared/data-access-shared';
import { Observable } from 'rxjs';

export const TOKEN_KEY = 'token';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private readonly localStorageService: LocalStorageService) {}
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token: string | null = this.localStorageService.getItem(TOKEN_KEY);

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return next.handle(request);
  }
}
