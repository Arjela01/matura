import { CommonModule } from '@angular/common';
import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import { LoaderService} from "../loader-service/loader.service";

@Component({
  selector: 'msh-global-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="this.loader.getLoading()" class="cssload-container">
      <div class="cssload-speeding-wheel"></div>
    </div>
  `,
  styleUrls: ['./global-spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class GlobalSpinnerComponent {
  constructor( public loader : LoaderService) {
  }
}
