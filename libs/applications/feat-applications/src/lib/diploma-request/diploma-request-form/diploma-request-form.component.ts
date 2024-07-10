import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'diploma-request-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './diploma-request-form.component.html',
  styleUrl: './diploma-request-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiplomaRequestFormComponent {}
