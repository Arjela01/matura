import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutService } from '@msh/layout/util-layout';
import { AppSidebarComponent } from '../app-sidebar/app-sidebar.component';
import { AppTopbarComponent } from '../app-topbar/app-topbar.component';
import { ButtonModule } from 'primeng/button';

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
  constructor(public layoutService: LayoutService) {}
  menuVisible = false;

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
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
