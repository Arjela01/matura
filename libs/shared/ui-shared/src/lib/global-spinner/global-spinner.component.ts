import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'msh-global-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overlay">
      <div class="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  `,
  styleUrls: ['./global-spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSpinnerComponent {}
