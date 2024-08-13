import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ACADEMIC_YEAR_KEY } from '@msh/configurations/data-access-configurations';
import { StorageService } from '@msh/shared/data-access-shared';
import { Observable, distinctUntilChanged, first, switchMap } from 'rxjs';
import { AuthFacade } from '../+state';
import { TOKEN_STORAGE_KEY } from './token.interceptor';
import { AcademicYear } from '@msh/shared/domain-models';

@Injectable()
export class FallInterceptor implements HttpInterceptor {
  constructor(private authFacade: AuthFacade) {}
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token: string | null = localStorage.getItem(TOKEN_STORAGE_KEY);
    return this.authFacade.isFall$.pipe(
      first(),
      distinctUntilChanged(),
      switchMap(isFall => {
        if (isFall) {
          const modifiedRequest = token
            ? request.clone({
                setHeaders: {
                  Fall: `${isFall}`,
                },
              })
            : request;
          return next.handle(modifiedRequest);
        } else {
          return next.handle(request);
        }
      })
    );
  }
}
