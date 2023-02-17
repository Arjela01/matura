import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UserProfile } from '@msh/layout/domain-layout';
import { UserProfileApiService } from '@msh/layout/data-access-layout';
import { AvatarModule } from 'primeng/avatar';
import { AuthFacade } from '@msh/auth/data-access-auth';

@UntilDestroy()
@Component({
  selector: 'msh-user-profile',
  standalone: true,
  imports: [CardModule, ButtonModule, AvatarModule],
  templateUrl: './user-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent implements OnInit {
  userProfile: UserProfile = {
    children: [],
    email: 'admin@admin.com',
    firstName: 'Admin',
    isActive: false,
    lastName: 'Admin',
    roleId: '',
    roleName: 'Admin',
    userName: 'Admin',
  };

  constructor(
    private userProfileService: UserProfileApiService,
    private auth: AuthFacade
  ) {}

  ngOnInit() {
    let userId = '';
    this.auth.user$.subscribe(res => (userId = res.userId));
    return this.userProfileService
      .getUserById(userId)
      .pipe()
      .subscribe(user =>
        this.userProfile = Object.assign({}, user)
      );
  }
}
