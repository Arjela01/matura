import { Injectable } from '@angular/core';
import { AuthFacade } from '@msh/auth/data-access-auth';
import { interval, of, Subject, switchMap, takeUntil } from 'rxjs';
const tokenVerifyTimer = 10000;

@Injectable({
  providedIn: 'root',
})
export class HeartbeatService {
  private readonly _stopTimer$ = new Subject<void>();

  startTime() {
    return interval(tokenVerifyTimer)
      .pipe(
        takeUntil(this._stopTimer$),
        switchMap(() => {
          return of([]);
        })
      )
      .subscribe();
  }

  public stopTimer(): void {
    this._stopTimer$.next();
    this.authFacade.logout();
  }
  constructor(private authFacade: AuthFacade) {}
}
