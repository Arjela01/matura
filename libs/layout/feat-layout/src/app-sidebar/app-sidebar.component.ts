import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { LayoutService } from '@msh/layout/util-layout';
import { AppMenuitemComponent } from '../app-menuitem/app-menuitem.component';

import { MenuItem } from 'primeng/api';
import { MenuStore } from '@msh/layout/data-access-layout';
import { map, Observable, Subject } from 'rxjs';
import { MenuNode } from '@msh/layout/domain-layout';
import { Router, RouterLink, RouterLinkWithHref } from '@angular/router';
import { AuthFacade } from '@msh/auth/data-access-auth';
import { DialogModule } from 'primeng/dialog';
import { AvatarModule } from 'primeng/avatar';
import { UserProfile } from '@msh/shared/domain-models';
import { UserProfileApiService } from '@msh/user-section/data-access-user-section';

@Component({
  selector: 'msh-app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    AppMenuitemComponent,
    RouterLinkWithHref,
    RouterLink,
    DialogModule,
    AvatarModule,
  ],
  providers: [MenuStore],
  templateUrl: './app-sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppSidebarComponent implements OnInit {
  userProfile!: UserProfile;
  userProfile$ = new Subject<UserProfile>();
  avatarLabel!: string;
  //TODO: This will be dynamic
  model$: Observable<MenuItem[]> = this.menuStore.menus$.pipe(
    map(menus => {
      return [
        {
          label: '',
          items: this.format(menus as MenuNode[]),
        },
      ];
    })
  );

  constructor(
    private readonly menuStore: MenuStore,
    private router: Router,
    public layoutService: LayoutService,
    private authFacade: AuthFacade,
    private userProfileService: UserProfileApiService
  ) {}

  ngOnInit() {
    this.menuStore.loadMenus();
    this.getUser();
  }

  private format(menus: MenuNode[]): MenuItem[] {
    const reformat = (node: MenuNode): MenuItem => {
      const output: MenuItem = {};
      output['icon'] = 'pi pi-fw pi-bookmark';
      output['label'] = node.text;

      if (node.children.length == 0) output['routerLink'] = node.url;
      if (node.children.length != 0)
        output['items'] = node.children?.map(x => reformat(x));
      return output;
    };
    const output = menus.map(x => reformat(x));

    const scan = (node: MenuItem): boolean => {
      if (
        this.router.isActive(node['routerLink'], {
          paths: 'exact',
          queryParams: 'ignored',
          matrixParams: 'ignored',
          fragment: 'ignored',
        })
      ) {
        node['expanded'] = false;
        return true;
      }

      if (node['items']?.length == 0) return false;

      node['expanded'] = node['items']
        ?.map(x => scan(x))
        .reduce((acc, current) => (current ? true : acc), false);

      return node['expanded'] ?? false;
    };

    output.map(x => scan(x));

    return output;
  }

  onLogoutClick() {
    this.authFacade.logout();
  }
  onLogoClick(){
    this.router.navigate(['/']).then();
  }
  onNewClick() {
    this.router.navigate(['/user-section/user-profile']).then();
  }
  getUser() {
    this.userProfileService.getLoggedInUserData().subscribe(response => {
      this.userProfile$.next(response.data);
      this.userProfile = Object.assign({}, response.data);
      this.avatarLabel =
        this.userProfile.firstName.charAt(0) +
        this.userProfile.lastName.charAt(0);
    });
  }
}
