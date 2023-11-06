import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutService } from '@msh/layout/util-layout';
import { AppSidebarComponent } from '../app-sidebar/app-sidebar.component';
import { AppTopbarComponent } from '../app-topbar/app-topbar.component';
import { ButtonModule } from 'primeng/button';
import { MenuItemClickService } from '@msh/shared/util-shared';

@Component({
  selector: 'msh-app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    AppTopbarComponent,
    AppSidebarComponent,
    ButtonModule,
  ],
  templateUrl: './app-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLayoutComponent {
  menuVisible = true;
  constructor(
    public layoutService: LayoutService,
    private menuItemClickService: MenuItemClickService
  ) {
    this.menuItemClickService.menuItemClicked$.subscribe(
      (menuItemClicked: boolean) => {
        if (menuItemClicked && this.menuVisible) {
          this.menuVisible = false;
        }
      }
    );
  }

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const screenWidth = (event.target as Window).innerWidth;
    this.menuVisible = screenWidth >= 600;
  }

  get containerClass() {
    return {
      'layout-theme-light': this.layoutService.config.colorScheme === 'light',
      'layout-static': this.layoutService.config.menuMode === 'static',
      'layout-static-inactive':
        this.layoutService.state.staticMenuDesktopInactive &&
        this.layoutService.config.menuMode === 'static',
      'layout-overlay-active': this.layoutService.state.overlayMenuActive,
      'layout-mobile-active': this.layoutService.state.staticMenuMobileActive,
      'p-input-filled': this.layoutService.config.inputStyle === 'filled',
      'p-ripple-disabled': !this.layoutService.config.ripple,
    };
  }
}
