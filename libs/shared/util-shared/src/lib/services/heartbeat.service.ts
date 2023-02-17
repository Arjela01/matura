import { Injectable } from '@angular/core';
import { AuthFacade } from '@msh/auth/data-access-auth';
import { interval, Subject, switchMap, takeUntil } from 'rxjs';
import { APIService } from './api.service';
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
          return this.apiService.get('/Auth/VerifyToken');
        })
      )
      .subscribe({
        next: () => {},
        error: () => {
          this.authFacade.logout();
        },
      });
  }

  public stopTimer(): void {
    this._stopTimer$.next();
  }
  constructor(private authFacade: AuthFacade, private apiService: APIService) {}
}
