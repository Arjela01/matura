import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';

import { UntilDestroy } from '@ngneat/until-destroy';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';

import { RippleModule } from 'primeng/ripple';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CurrentYearStudentGradesApiService } from '@msh/reports/data-access-reports';

@UntilDestroy()
@Component({
  selector: 'msh-ealbania-grades-data-view',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ToolbarModule,
    RippleModule,
    InputGroupModule,
    InputTextModule,
    ReactiveFormsModule,
    FormsModule,
    InputGroupAddonModule,
  ],
  templateUrl: './ealbania-grades-data-view.component.html',
  styleUrls: ['./ealbania-grades-data-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class EalbaniaGradesDataViewComponent {
  nid = '';
  response: any = undefined;

  constructor(
    private currentYearStudentGradesApiService: CurrentYearStudentGradesApiService,
    private cd: ChangeDetectorRef
  ) {}

  onSearchClick() {
    this.response = undefined;
    this.currentYearStudentGradesApiService
      .getGradesForStudentByNid(this.nid)
      .subscribe(response => {
        this.response = response;
        this.cd.markForCheck();
      });
  }
}
