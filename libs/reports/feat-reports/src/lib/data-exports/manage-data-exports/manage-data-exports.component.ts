import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';

import { DataExport } from '@msh/shared/domain-models';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { RippleModule } from 'primeng/ripple';
import { DataExportApiService } from '@msh/reports/data-access-reports';
import * as FileSaver from 'file-saver';

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
export class ManageDataExportsComponent implements OnInit {
  dataExports: DataExport[] = [];

  roles: DropdownModel<number>[] = [];

  constructor(
    private dataExportApiService: DataExportApiService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.dataExportApiService
      .loadDataExports()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.dataExports = (response.data as DataExport[]).filter(
          x => x.isVisible
        );
        this.cd.detectChanges();
      });
  }

  download(dataExport: DataExport) {
    this.dataExportApiService
      .export(dataExport.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        const byteCharacters = atob(response.data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob: any = new Blob([byteArray], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        FileSaver.saveAs(blob, dataExport.name);
      });
  }
}
