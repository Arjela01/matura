import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'msh-access-denied',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './access-denied.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessDeniedComponent {}
