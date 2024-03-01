import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
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

@Injectable()
export class ErrorInterceptorService implements HttpInterceptor {
  constructor(private notificationsService: GlobalToastService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case 400:
            return this.handleError(error, ERROR_400);
          case 401:
            return this.handleError(error, ERROR_401);
          case 403:
            return this.handleError(error, ERROR_403);
          case 404:
            return this.handleError(error, ERROR_404);
          case 405:
            return this.handleError(error, ERROR_405);
          case 412:
            return this.handleError(error, ERROR_412);
          case 500:
            return this.handleError(error, ERROR_500);
          case 501:
            return this.handleError(error, ERROR_501);
          case 503:
            return this.handleError(error, ERROR_503);
          default:
            this.notificationsService.showError(
              'Ndodhi një gabim, provoni më vonë'
            );
            throw error;
        }
      })
    );
  }

  handleError(error: HttpErrorResponse, message: string): Observable<never> {
    if (error.status === 401) {
      localStorage.clear();
      window.location.reload();
    }

    this.notificationsService.showError(message);
    throw error;
  }
}
