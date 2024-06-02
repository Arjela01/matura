import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,

} from '@angular/core';

import { UntilDestroy } from '@ngneat/until-destroy';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';

import { RippleModule } from 'primeng/ripple';

@UntilDestroy()
@Component({
  selector: 'msh-manage-data-exports',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ToolbarModule,
    RippleModule,
  ],
  templateUrl: './smip-data-view.component.html',
  styleUrls: ['./smip-data-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class SmipDataViewComponent {

}
