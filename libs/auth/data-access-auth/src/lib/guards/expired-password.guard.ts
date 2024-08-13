import { Injectable } from '@angular/core';

import { StorageService } from '@msh/shared/data-access-shared';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class ExpiredPasswordGuard {
  constructor(private storageService: StorageService) {}
  token: any = '';
  canActivate(): boolean {
    try {
      this.token = jwtDecode(this.storageService.getItem('token'));
    } catch (ex) {
      return true;
    }

    if (this.token && this.token.NeedResetPassword === 'true') {
      return true;
    } else {
      return false;
    }
  }
}
