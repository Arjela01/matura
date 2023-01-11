import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '@msh/shared/data-access-shared';
import { Observable } from 'rxjs';

export const TOKEN_STORAGE_KEY = 'token';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private readonly storageService: StorageService) {}
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token: string | null = this.storageService.getItem(TOKEN_STORAGE_KEY);

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
