import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay, mergeMap, of, retryWhen } from 'rxjs';
import {
  ERROR_400,
  ERROR_401,
  ERROR_403,
  ERROR_404,
  ERROR_405,
  ERROR_412,
  ERROR_500,
  ERROR_501,
  ERROR_503,
} from '../constants/error-mesages';
import { GlobalToastService } from '../services/global-toast.service';

export const maxRetries = 1;
export const delayMs = 500;

@Injectable()
export class ErrorInterceptorService implements HttpInterceptor {
  constructor(private notificationsService: GlobalToastService) {}
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      retryWhen((error): Observable<any> => {
        return error.pipe(
          mergeMap((error, index) => {
            switch (error.status) {
              case 400:
                return this.handleError(error, index, ERROR_400);
              case 401:
                return this.handleError(error, index, ERROR_401);
              case 403:
                return this.handleError(error, index, ERROR_403);
              case 404:
                return this.handleError(error, index, ERROR_404);
              case 405:
                return this.handleError(error, index, ERROR_405);
              case 412:
                return this.handleError(error, index, ERROR_412);
              case 500:
                return this.handleError(error, index, ERROR_500);
              case 501:
                return this.handleError(error, index, ERROR_501);
              case 503:
                return this.handleError(error, index, ERROR_503);

              default:
                this.notificationsService.showError(
                  'Ndodhi një gabim,provoni më vonë'
                );
                throw error;
            }
          })
        );
      })
    );
  }

  handleError(error: any, index: number, message: string) {
    if (index < maxRetries) {
      return of(error).pipe(delay(delayMs));
    }
    if (error.status === 401) {
      localStorage.clear();
      window.location.reload();
    }
    this.notificationsService.showError(message);
    throw error;
  }
}
