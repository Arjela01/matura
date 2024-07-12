import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { UntilDestroy } from '@ngneat/until-destroy';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalToastService } from '@msh/shared/util-shared';
import * as FileSaver from 'file-saver';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { DiplomaRequestApiService } from '@msh/applications/data-access-applications';
import { ActivatedRoute } from '@angular/router';
import { DiplomaRequest } from '@msh/shared/domain-models';

@UntilDestroy()
@Component({
  selector: 'msh-diploma-request-print',
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
  templateUrl: './diploma-request-print.component.html',
  styleUrls: ['./diploma-request-print.component.scss'],
  providers: [ConfirmationService],
})
export class DiplomaRequestPrintComponent implements OnInit {
  pdfSrc!: any;
  url!: string;
  file: any;
  id!: any;
  diplomaRequest = {} as DiplomaRequest;

  constructor(
    private readonly toastService: GlobalToastService,
    private readonly diplomaRequestApiService: DiplomaRequestApiService,
    private cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.getDiplomaById();
      this.getDiplomaForStudent();
    }
  }

  isValidPdf(response: string): boolean {
    if (!response.trim().startsWith('%PDF-')) {
      return false;
    }
    return true;
  }

  getDiplomaForStudent() {
    this.diplomaRequestApiService.print(this.id).subscribe({
      next: async (response: any) => {
        const responseText = await response.text();
        if (this.isValidPdf(responseText)) {
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
        } else {
          const resp = JSON.parse(responseText);
          this.toastService.showError(resp.errorMessage);

          const blob = new Blob(undefined, { type: 'application/pdf' });
          this.url = URL.createObjectURL(blob);
          this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
          this.file = response;
        }
        this.cd.markForCheck();
      },
    });
  }

  onSealAndDownloadClick() {
    if (!this.diplomaRequest) return;

    this.diplomaRequestApiService
      .printSealed(this.diplomaRequest.id)
      .subscribe({
        next: async (response: any) => {
          const responseText = await response.text();
          if (this.isValidPdf(responseText)) {
            try {
              const blob = new Blob([response], {
                type: 'application/pdf',
              });
              FileSaver.saveAs(blob, `Diploma_Sealed_${this.diplomaRequest.studentStudentId}`);
            } catch (error) {
              this.toastService.showError(error as string);
            }
          } else {
            const resp = JSON.parse(responseText);
            this.toastService.showError(resp.errorMessage);
          }
          this.cd.markForCheck();
        },
      });
  }

  sendToEAlbania() {
    this.diplomaRequestApiService
      .sendToEAlbania(this.id)
      .subscribe((response: any) => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Diploma u dërgua me sukses');
        } else {
          this.toastService.showError(response.errorMessage);
        }
      });
  }

  getDiplomaById(): void {
    this.diplomaRequestApiService
      .getOne(this.id)
      .pipe()
      .subscribe(response => {
        this.diplomaRequest = response.data;
        this.cd.detectChanges();
      });
  }
}
