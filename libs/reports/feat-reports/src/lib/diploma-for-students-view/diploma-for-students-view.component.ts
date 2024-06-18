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
import { DiplomasForStudentApiService } from '../../../../data-access-reports/src/lib/diplomas-for-students-view/diplomas-for-student-api.service';
import { GlobalToastService } from '@msh/shared/util-shared';

@UntilDestroy()
@Component({
  selector: 'msh-diploma-for-students-view',
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
  templateUrl: './diploma-for-students-view.component.html',
  styleUrls: ['./diploma-for-students-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class DiplomaForStudentsViewComponent {
  maturaId = '';
  pdfSrc: string | ArrayBuffer | null = null;
  file: any;

  constructor(
    private readonly diplomasForStudent: DiplomasForStudentApiService,
    private readonly toastService: GlobalToastService,
    private cd: ChangeDetectorRef
  ) {}

  onSearchClick() {
    this.diplomasForStudent
      .getDiplomasForStudentById(this.maturaId)
      .subscribe(response => {
        if (response) {
          this.file = response;
          const byteArray = new Uint8Array(this.file);
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          this.pdfSrc = URL.createObjectURL(blob);
          console.log(123, response);
          console.log(123, this.pdfSrc);
        } else this.toastService.showError(response);
        this.cd.markForCheck();
      });
  }

  // onSealAndDownloadClick() {
  //   this.diplomasForStudent
  //     .getDiplomasForStudentById(this.maturaId)
  //     .subscribe(response => {
  //       if (response) {
  //         this.file = response;
  //         const byteArray = new Uint8Array(this.file);
  //         const blob = new Blob([byteArray], { type: 'application/pdf' });
  //         this.pdfSrc = URL.createObjectURL(blob);
  //         console.log(123, response);
  //         console.log(123, this.pdfSrc);
  //       } else this.toastService.showError(response);
  //       this.cd.markForCheck();
  //     });
  // }
}
