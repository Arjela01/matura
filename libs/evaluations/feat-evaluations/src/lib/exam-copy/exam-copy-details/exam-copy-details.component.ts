import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ExamCopyApiService } from '@msh/evaluations/data-access-evaluations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as FileSaver from 'file-saver';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ApproveExamCopyComponent } from '../approve-exam-copy/approve-exam-copy.component';
import { Observable } from 'rxjs';
import {
  ExamCopy,
  ExamCopyStatuses,
  ExamCopyUpdate,
  ExamGradeChange,
  StatusEnum,
} from '@msh/shared/domain-models';
import { AppDatePipe } from '@msh/shared/ui-shared';
import { ActivatedRoute, Router } from '@angular/router';
import { Ripple } from 'primeng/ripple';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { GlobalToastService } from '@msh/shared/util-shared';

@UntilDestroy()
@Component({
  selector: 'msh-exam-copy-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    RadioButtonModule,
    InputTextareaModule,
    ButtonModule,
    ApproveExamCopyComponent,
    CheckboxModule,
    DatePipe,
    AppDatePipe,
    Ripple,
    TableModule,
    TooltipModule,
    FileUploadModule,
    DropdownModule,
  ],
  providers: [DatePipe],
  templateUrl: './exam-copy-details.component.html',
  styleUrls: ['./exam-copy-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamCopyDetailsComponent implements OnInit {
  @ViewChild('form', { static: true }) form!: NgForm;
  statuses: DropdownModel<any>[] = [];
  base64?: string;
  submitted = false;
  confirmModal = false;
  updatedFile!: File;
  updatedExamCopy: ExamCopyUpdate = {};
  examCopy: ExamCopy = {};
  id = '';

  constructor(
    private cd: ChangeDetectorRef,
    private readonly examCopyService: ExamCopyApiService,
    private readonly route: ActivatedRoute,
    private readonly toastService: GlobalToastService,
    private readonly router: Router
  ) {
    this.id = this.route.snapshot.params['applicationId'];
  }

  onFormClose() {
    this.confirmModal = false;
  }

  goBack() {
    this.router.navigate([`evaluations/exam-copy/list-of-exam-copies`]);
  }

  ngOnInit(): void {
    this.getDetails(this.id);
    this.statuses = Object.keys(StatusEnum)
      .filter(key => !isNaN(Number(key)))
      .map(key => this.getTranslatedStatus(Number(key)));
  }

  onConfirm() {
    this.confirmModal = true;
  }

  getDetails(applicationId: string) {
    this.examCopyService
      .getById(applicationId)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examCopy = response.data;
        this.cd.detectChanges();
      });
  }

  downloadFile(document: any) {
    const blob = this.dataURItoBlob(document);
    const file = new File([blob], this.examCopy.documentName ?? 'document');
    FileSaver.saveAs(file, this.examCopy.documentName);
  }

  dataURItoBlob(dataURI: any) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array]);
    return blob;
  }

  onSubmit() {
    const valuesToSend: ExamCopyUpdate = {
      id: this.id,
      documentName: this.examCopy.documentName,
      attachedDocument: this.examCopy.attachedDocument,
      statusEnum: {
        id: this.examCopy.status,
        displayText: this.getStatusDisplayText(this.examCopy.status) as any,
      },
      comments: this.examCopy.comments,
    };
    this.submitted = true;
    if (this.form.valid) {
      this.updateExamCopy(valuesToSend);
    }
  }

  updateExamCopy(examCopy: ExamCopyUpdate) {
    this.examCopyService
      .update(examCopy)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Veprimi u krye me sukses');
          this.goBack();
        } else this.toastService.showError(response.errorMessage);
        if (response.isBadRequest)
          this.toastService.showError('Ndodhi një problem!');
      });
  }

  onFileUploaded(file: File) {
    this.updatedFile = file;
    this.examCopy.documentName = this.updatedFile ? this.updatedFile.name : '';
  }

  handleUpload(data: any) {
    const file = data.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      this.base64 = base64.split(',')[1];
      this.examCopy.attachedDocument = this.base64;
      this.examCopy.documentName = file.name;
      this.cd.detectChanges();
    };
  }

  getTranslatedStatus(key: number): DropdownModel<any> {
    const translations: { [key: number]: string } = {
      1: 'Aplikim në Pritje',
      2: 'Aplikim i Pranuar',
      3: 'Aplikim i Refuzuar',
    };
    return { key, value: translations[key] || '' };
  }

  getStatusDisplayText(statusId?: number): string {
    const status = this.statuses.find(status => status.key === statusId);
    return status ? status.value : '';
  }
}
