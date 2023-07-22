import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';

import { DataExport } from '@msh/shared/domain-models';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { RippleModule } from 'primeng/ripple';
import { DataExportApiService } from '@msh/reports/data-access-reports';
import * as FileSaver from "file-saver";

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

  constructor(private dataExportApiService: DataExportApiService) {}

  ngOnInit(): void {
    this.dataExportApiService
      .loadDataExports()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.dataExports = response;
      });
  }

  download(dataExport: DataExport) {
    this.dataExportApiService
      .export(dataExport.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        const blob: any = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        FileSaver.saveAs(blob, dataExport.text);
      });
  }
}
