import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthFacade } from '../+state';
import { PermissionEnum } from '../models/permission-enum';
import { jwtDecode } from "jwt-decode";

@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class PermissionCheckService {
  permissions: string[] | undefined;

  constructor(private authFacade: AuthFacade) {
    this.setupPermissionsSubscription();
  }

  private setupPermissionsSubscription() {
    this.authFacade.token$.pipe(untilDestroyed(this)).subscribe(token => {
      const decodedToken: any = jwtDecode(token as string);
      const permissions = decodedToken.Permissions;

      if (permissions) {
        this.permissions = JSON.parse(permissions);
      } else {
        this.permissions = [];
      }
    });
  }

  hasPermission(permission: typeof PermissionEnum): boolean {
    if (this.permissions) {
      return this.permissions.includes(permission as any);
    }
    return false;
  }
}
