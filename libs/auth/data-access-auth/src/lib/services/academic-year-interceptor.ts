import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ACADEMIC_YEAR_KEY } from '@msh/configurations/data-access-configurations';
import { StorageService } from '@msh/shared/data-access-shared';
import { Observable } from 'rxjs';

@Injectable()
export class AcademicYearInterceptor implements HttpInterceptor {
  constructor(private readonly storageService: StorageService) {}
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const academicYearFilter: any = localStorage.getItem(ACADEMIC_YEAR_KEY);
    if (academicYearFilter) {
      request = request.clone({
        setHeaders: {
          AcademicYearIdFilter: `${JSON.parse(academicYearFilter).id}`,
        },
      });
    }

    return next.handle(request);
  }
}
