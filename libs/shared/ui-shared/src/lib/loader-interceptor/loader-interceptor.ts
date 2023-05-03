import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../loader-service/loader.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private totalRequests = 0;
  private urlWithoutSpinner = 'VerifyToken';
  private authUrlWithoutSpinner = 'Auth';
  constructor(private loadingService: LoaderService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.totalRequests++;
    if (
      request.url.includes(this.urlWithoutSpinner) ||
      request.url.includes(this.authUrlWithoutSpinner)
    ) {
      this.loadingService.setLoading(false);
    } else {
      this.loadingService.setLoading(true);
    }

    return next.handle(request).pipe(
      finalize(() => {
        this.totalRequests--;
        console.log(this.totalRequests);
        if (this.totalRequests == 0) {
          this.loadingService.setLoading(false);
        }
      })
    );
  }
}
