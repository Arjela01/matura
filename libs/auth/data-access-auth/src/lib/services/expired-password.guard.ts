import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { StorageService } from '@msh/shared/data-access-shared';
import jwt_decode from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class ExpiredPasswordGuard implements CanActivate {
  constructor(private storageService: StorageService) {}
  token: any = '';
  canActivate(): boolean {
    try {
      this.token = jwt_decode(this.storageService.getItem('token'));
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
