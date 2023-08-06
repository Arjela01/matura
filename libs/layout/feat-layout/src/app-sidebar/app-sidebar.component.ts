import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkWithHref } from '@angular/router';
import { AuthFacade } from '@msh/auth/data-access-auth';
import { AcademicYearApiService } from '@msh/configurations/data-access-configurations';
import { MenuStore } from '@msh/layout/data-access-layout';
import { MenuNode } from '@msh/layout/domain-layout';
import { AcademicYear, UserProfile } from '@msh/shared/domain-models';
import { UserProfileApiService } from '@msh/user-section/data-access-user-section';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import {
  BehaviorSubject,
  Observable,
  Subject,
  combineLatest,
  map,
  switchMap,
} from 'rxjs';
import { AppMenuitemComponent } from '../app-menuitem/app-menuitem.component';
import { GlobalSpinnerComponent, LoaderService } from '@msh/shared/util-shared';

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
    FormsModule,
    InputTextModule,
    GlobalSpinnerComponent,
    ConfirmDialogModule,
    ButtonModule,
    DropdownModule,
  ],
  providers: [[MenuStore]],
  templateUrl: './app-sidebar.component.html',
  styleUrls: ['./app-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppSidebarComponent implements OnInit {
  userProfile!: UserProfile;
  userProfile$ = new Subject<UserProfile>();
  avatarLabel!: string;
  displayModal = false;
  academicYears: any[] = [];
  academicYearForm: Partial<AcademicYear> = {
    id: 0,
    year: '',
  };
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

  loading$ = this.loader.loading$.pipe(map(data => data));
  academicYear$ = new BehaviorSubject<AcademicYear | null>(null);
  academicYear: Partial<AcademicYear> | null = null;
  constructor(
    private readonly menuStore: MenuStore,
    private router: Router,
    protected authFacade: AuthFacade,
    private userProfileService: UserProfileApiService,
    public loader: LoaderService,
    private academicApiService: AcademicYearApiService
  ) {}

  ngOnInit() {
    this.menuStore.loadMenus();
    const token = localStorage.getItem('token');
    if (token) {
      this.authFacade.academicYear$
        .pipe(
          switchMap((data: any) => {
            if (!data) {
              try {
                data = JSON.parse(
                  localStorage.getItem('academicYear') as string
                );
              } catch (err) {
                data = null;
              }
            }
            this.academicYear = { ...data };
            this.academicYearForm = Object.assign({}, { ...this.academicYear });

            return combineLatest([this.getUser(), this.getAcademicYears()]);
          })
        )
        .subscribe(([user, academicYear]) => {
          this.userProfile$.next(user.data);
          this.userProfile = Object.assign({}, user.data);
          this.academicYears = academicYear.data;
          if (user.data && user.data.firstName) {
            this.avatarLabel =
              user.data.firstName.charAt(0) + user.data.lastName.charAt(0);
          }
        });
    }
  }

  showModal() {
    this.displayModal = true;
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
  onLogoClick() {
    this.router.navigate(['/']).then();
  }
  onNewClick() {
    this.router.navigate(['/user-section/user-profile']).then();
  }
  getUser(): Observable<any> {
    return this.userProfileService.getLoggedInUserData();
  }
  onModalClose() {
    this.displayModal = false;
  }

  getAcademicYears(): Observable<any> {
    return this.academicApiService.getAcademicYearsFiltered();
  }
  changeAcademicYear() {
    const yearToFind = this.academicYears.find(
      year => year.key === this.academicYearForm.id
    );
    const { key: id, value: year, additionalValue: json } = yearToFind;
    console.log({ id, year });
    this.authFacade.changeAcademicYear(JSON.parse(json));
    this.displayModal = false;
  }
}
