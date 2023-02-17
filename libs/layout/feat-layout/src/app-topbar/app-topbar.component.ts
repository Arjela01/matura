import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkWithHref } from '@angular/router';
import { AuthFacade } from '@msh/auth/data-access-auth';
import { LayoutService } from '@msh/layout/util-layout';
import { DialogModule } from 'primeng/dialog';
import {UserProfileComponent} from "../user-profile/user-profile.component";


@Component({
  selector: 'msh-app-topbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLinkWithHref,
    RouterLink,
    DialogModule,
    UserProfileComponent,
  ],
  templateUrl: './app-topbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppTopbarComponent {
  displayModal = false;
  constructor(
    public layoutService: LayoutService,
    private authFacade: AuthFacade
  ) {}

  onLogoutClick() {
    this.authFacade.logout();
  }
  onNewClick() {
    this.displayModal = true;
  }

  onModalClose() {
    this.displayModal = false;
  }
}
