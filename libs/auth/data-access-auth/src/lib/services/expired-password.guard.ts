import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { StorageService } from '@msh/shared/data-access-shared';
import jwt_decode from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class ExpiredPasswordGuard implements CanActivate {
  constructor(private storageService: StorageService) {}

  canActivate(): boolean {
    const token: any = jwt_decode(this.storageService.getItem('token'));
    if (token && token.NeedResetPassword === 'true') {
      return true;
    } else {
      return false;
    }
  }
}
