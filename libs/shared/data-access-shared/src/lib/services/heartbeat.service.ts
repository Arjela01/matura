import { Injectable, Injector } from '@angular/core';
import { AuthFacade } from '@msh/auth/data-access-auth';
import { APIService } from '@msh/shared/util-shared';
import { interval, Subject, switchMap, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeartbeatService {
  tokenVerifyTimer = 10000;
  auth = this.injector.get<AuthFacade>(AuthFacade);
  private readonly _stopTimer$ = new Subject<void>();
  startTime() {
    return interval(this.tokenVerifyTimer)
      .pipe(
        takeUntil(this._stopTimer$),
        switchMap(() => {
          return this.apiService.get('/Auth/VerifyToken');
        })
      )
      .subscribe({
        error: () => {
          this.auth.logout();
        },
      });
  }

  public stopTimer(): void {
    this._stopTimer$.next();
  }
  constructor(private apiService: APIService, private injector: Injector) {}
}
