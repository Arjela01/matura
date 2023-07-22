import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { UntilDestroy } from '@ngneat/until-destroy';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';

import { DataExport } from '@msh/shared/domain-models';
import { DropdownModel } from '@msh/shared/data-access-shared';
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
  templateUrl: './manage-data-exports.component.html',
  styleUrls: ['./manage-data-exports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageDataExportsComponent {
  filters: LazyLoadEvent | null = null;

  totalRecords = 0;
  selectedDataExport: DataExport | null = null;
  displayModal = false;

  roles: DropdownModel<number>[] = [];

  onNewClick() {
    this.displayModal = true;
    this.selectedDataExport = {} as DataExport;
  }
}
