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
import { DiplomasForStudentApiService } from '@msh/reports/data-access-reports';
import { GlobalToastService } from '@msh/shared/util-shared';
import { DomSanitizer } from '@angular/platform-browser';
import * as FileSaver from 'file-saver';

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
  maturaId!: string;
  pdfSrc!: any;
  url!: string;
  file: any;

  constructor(
    private readonly diplomasForStudent: DiplomasForStudentApiService,
    private readonly toastService: GlobalToastService,
    private cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  onSearchClick() {
    this.diplomasForStudent.getDiplomasForStudentById(this.maturaId).subscribe({
      next: (response: Blob) => {
        if (response) {
          try {
            const blob = new Blob([response], { type: 'application/pdf' });
            this.url = URL.createObjectURL(blob);
            this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
              this.url
            );
            this.file = response;
          } catch (error) {
            this.toastService.showError(error as string);
          }
        }
        this.cd.markForCheck();
      },
      error: err => {
        this.toastService.showError('Nuk u gjet diploma për këtë maturant!');
      },
    });
  }

  onSealAndDownloadClick() {
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onloadend = () => {
      const base64data = reader.result?.toString().split(',')[1] ?? '';
      const valuesToSend = {
        studentId: this.maturaId,
        file: base64data,
      };
      this.diplomasForStudent.sendDiplomaToSeal(valuesToSend).subscribe({
        next: response => {
          if (response.isSuccessful) {
            const blob = new Blob([response.data], {
              type: 'application/pdf',
            });
            FileSaver.saveAs(blob, `Diploma`);
            this.toastService.showSuccess('Diploma u vulos me sukses');
          } else {
            this.toastService.showError(response.errorMessage);
          }
        },
        error: err => {
          if (err.status === 400) {
            this.toastService.showError(err.error.errorMessage);
          }
          this.cd.markForCheck();
        },
      });
    };
  }
}
