import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'msh-bar-code-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bar-code-form.component.html',
  styleUrls: ['./bar-code-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarCodeFormComponent {}
