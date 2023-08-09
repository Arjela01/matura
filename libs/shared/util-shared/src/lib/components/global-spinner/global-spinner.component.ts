import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'msh-global-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loader-container">
      <div class="loader-speeding-wheel"></div>
    </div>
  `,
  styleUrls: ['./global-spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class GlobalSpinnerComponent {
  constructor(public loader: LoaderService) {}
}
