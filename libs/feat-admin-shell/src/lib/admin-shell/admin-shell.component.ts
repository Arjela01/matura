import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppLayoutComponent } from '@msh/layout/feat-layout';

@Component({
  selector: 'msh-admin-shell',
  standalone: true,
  imports: [CommonModule, AppLayoutComponent],
  templateUrl: './admin-shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminShellComponent {}
