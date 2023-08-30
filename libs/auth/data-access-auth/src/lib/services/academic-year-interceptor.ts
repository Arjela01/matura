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

@Injectable()
export class AcademicYearInterceptor implements HttpInterceptor {
  constructor(
    private readonly storageService: StorageService,
    private authFacade: AuthFacade
  ) {}
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const academicYearFilter: any = localStorage.getItem(ACADEMIC_YEAR_KEY);
    const token: any = localStorage.getItem(TOKEN_STORAGE_KEY);
    return this.authFacade.academicYear$.pipe(
      first(),
      distinctUntilChanged(),
      switchMap(accYear => {
        if (accYear && accYear.id) {
          const academicYear = token
            ? request.clone({
                setHeaders: {
                  AcademicYearIdFilter: `${accYear.id}`,
                },
              })
            : request;
          return next.handle(academicYear);
        } else {
          return next.handle(request);
        }
      })
    );
  }
}
