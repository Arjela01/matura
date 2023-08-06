import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthFacade } from '../+state';
import { ExpiredPasswordGuard } from './expired-password.guard';

@Injectable({ providedIn: 'root' })
export class AuthGuard  {
  constructor(
    private authFacade: AuthFacade,
    private router: Router,
    private expiredPasswordGuard: ExpiredPasswordGuard
  ) {}

  canActivate(): Observable<boolean> {
    return this.authFacade.isAuthenticated$.pipe(
      take(1),
      map(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigate(['/login']);
          return false;
        } else {
          if (this.expiredPasswordGuard.canActivate()) {
            this.router.navigate(['/reset-password']);
            return false;
          } else {
            return true;
          }
        }
      })
    );
  }
}
