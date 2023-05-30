import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ACADEMIC_YEAR_KEY } from '@msh/configurations/data-access-configurations';
import { StorageService } from '@msh/shared/data-access-shared';
import { Observable, first, switchMap } from 'rxjs';
import { AuthFacade } from '../+state';

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
    this.authFacade.academicYear$.pipe();
    const academicYearFilter: any = localStorage.getItem(ACADEMIC_YEAR_KEY);
    return this.authFacade.academicYear$.pipe(
      first(),
      switchMap(token => {
        const academicYear = token
          ? request.clone({
              setHeaders: {
                AcademicYearIdFilter: `${JSON.parse(academicYearFilter).id}`,
              },
            })
          : request;
        return next.handle(academicYear);
      })
    );
  }
}
