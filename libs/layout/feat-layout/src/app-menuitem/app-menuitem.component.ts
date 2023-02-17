import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnChanges,
} from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterLinkWithHref,
} from '@angular/router';
import { filter } from 'rxjs';
import { RippleModule } from 'primeng/ripple';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[msh-app-menuitem]',
  standalone: true,
  imports: [
    CommonModule,
    RouterLinkWithHref,
    RouterLinkActive,
    RippleModule,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container>
      <div
        *ngIf="root && item.visible !== false"
        class="layout-menuitem-root-text">
        {{ item.label }}
      </div>
      <a
        *ngIf="(!item.routerLink || item.items) && item.visible !== false"
        [attr.href]="item.url"
        (click)="itemClick($event)"
        [ngClass]="item.class"
        [attr.target]="item.target"
        tabindex="0"
        pRipple>
        <span class="layout-menuitem-icon"
          ><svg
            width="18"
            height="23"
            viewBox="0 0 18 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M11 2.06934V6.19988C11 6.75993 11 7.03995 11.109 7.25387C11.2049 7.44203 11.3578 7.59501 11.546 7.69088C11.7599 7.79988 12.0399 7.79988 12.6 7.79988H16.7305M11 16.7998H5M13 12.7998H5M17 9.78803V16.9998C17 18.68 17 19.52 16.673 20.1618C16.3854 20.7263 15.9265 21.1852 15.362 21.4728C14.7202 21.7998 13.8802 21.7998 12.2 21.7998H5.8C4.11984 21.7998 3.27976 21.7998 2.63803 21.4728C2.07354 21.1852 1.6146 20.7263 1.32698 20.1618C1 19.52 1 18.68 1 16.9998V6.5998C1 4.91965 1 4.07957 1.32698 3.43783C1.6146 2.87335 2.07354 2.41441 2.63803 2.12679C3.27976 1.7998 4.11984 1.7998 5.8 1.7998H9.01178C9.74555 1.7998 10.1124 1.7998 10.4577 1.88269C10.7638 1.95619 11.0564 2.0774 11.3249 2.24188C11.6276 2.42741 11.887 2.68684 12.4059 3.20569L15.5941 6.39392C16.113 6.91277 16.3724 7.1722 16.5579 7.47495C16.7224 7.74337 16.8436 8.036 16.9171 8.34211C17 8.68737 17 9.05426 17 9.78803Z"
              stroke="#D0D5DD"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </span>
        <span class="layout-menuitem-text">{{ item.label }}</span>
        <i
          class="pi pi-fw pi-angle-down layout-submenu-toggler"
          *ngIf="item.items"></i>
      </a>
      <a
        *ngIf="item.routerLink && !item.items && item.visible !== false"
        (click)="itemClick($event)"
        [ngClass]="item.class"
        [routerLink]="item.routerLink"
        routerLinkActive="active-route"
        [routerLinkActiveOptions]="
          item.routerLinkActiveOptions || {
            paths: 'exact',
            queryParams: 'ignored',
            matrixParams: 'ignored',
            fragment: 'ignored'
          }
        "
        [fragment]="item.fragment"
        [queryParamsHandling]="item.queryParamsHandling"
        [preserveFragment]="item.preserveFragment"
        [skipLocationChange]="item.skipLocationChange"
        [replaceUrl]="item.replaceUrl"
        [state]="item.state"
        [queryParams]="item.queryParams"
        [attr.target]="item.target"
        tabindex="0"
        pRipple>
        <!--        <i [ngClass]="item.icon" class="layout-menuitem-icon"></i>-->
        <span class="layout-menuitem-text">{{ item.label }}</span>
        <i
          class="pi pi-fw pi-angle-down layout-submenu-toggler"
          *ngIf="item.items"></i>
      </a>

      <ul
        *ngIf="item.items && item.visible !== false"
        [@children]="submenuAnimation">
        <ng-template ngFor let-child let-i="index" [ngForOf]="item.items">
          <li
            msh-app-menuitem
            [item]="child"
            [index]="i"
            [parentKey]="key"
            [class]="child.badgeClass"></li>
        </ng-template>
      </ul>
    </ng-container>
  `,
  animations: [
    trigger('children', [
      state(
        'collapsed',
        style({
          height: '0',
        })
      ),
      state(
        'expanded',
        style({
          height: '*',
        })
      ),
      transition(
        'collapsed <=> expanded',
        animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')
      ),
    ]),
  ],
})
export class AppMenuitemComponent implements OnChanges {
  @Input() item: any;

  @Input() index!: number;

  @Input() @HostBinding('class.layout-root-menuitem') root!: boolean;

  @Input() parentKey!: string;

  active = false;

  key = '';

  constructor(public router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(params => {
        if (this.item.routerLink) {
          this.updateActiveStateFromRoute();
        }
      });
  }

  ngOnInit() {
    this.key = this.parentKey
      ? this.parentKey + '-' + this.index
      : String(this.index);

    if (this.item.routerLink) {
      this.updateActiveStateFromRoute();
    }
  }

  ngOnChanges() {
    this.active = this.item.expanded ?? false;
  }

  updateActiveStateFromRoute() {
    this.router.isActive(this.item.routerLink[0], {
      paths: 'exact',
      queryParams: 'ignored',
      matrixParams: 'ignored',
      fragment: 'ignored',
    });
  }

  itemClick(event: Event) {
    // avoid processing disabled items
    if (this.item.disabled) {
      event.preventDefault();
      return;
    }

    // execute command
    if (this.item.command) {
      this.item.command({ originalEvent: event, item: this.item });
    }

    // toggle active state
    if (this.item.items) {
      this.active = !this.active;
    }
  }

  get submenuAnimation() {
    return this.root ? 'expanded' : this.active ? 'expanded' : 'collapsed';
  }

  @HostBinding('class.active-menuitem')
  get activeClass() {
    return this.active && !this.root;
  }
}
