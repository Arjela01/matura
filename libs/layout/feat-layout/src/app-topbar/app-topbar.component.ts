import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {RouterLink, RouterLinkWithHref} from '@angular/router';
import { LayoutService } from '@msh/layout/util-layout';

@Component({
  selector: 'msh-app-topbar',
  standalone: true,
  imports: [CommonModule, RouterLinkWithHref, RouterLink],
  templateUrl: './app-topbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppTopbarComponent {
  constructor(public layoutService: LayoutService) {}
}
