import { Injectable } from '@angular/core';
import { AuthFacade } from '@msh/auth/data-access-auth';
import { of, switchMap, takeUntil, timer } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class HeartbeatService {
  init() {
    debugger;
    timer(0, 1000)
      .pipe(
        takeUntil(this.facadeAuth.isAuthenticated$),
        switchMap(() => {
          console.log('i loguar');
          debugger;
          return of([]);
        })
      )
      .subscribe();
  }
  constructor(private facadeAuth: AuthFacade) {}
}
