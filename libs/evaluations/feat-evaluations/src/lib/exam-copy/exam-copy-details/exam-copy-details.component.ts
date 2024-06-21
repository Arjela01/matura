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
import { RefuseExamCopyComponent } from '../refuse-exam-copy/refuse-exam-copy.component';
import { Observable } from 'rxjs';
import { ExamCopy, ExamCopyConfirm } from '@msh/shared/domain-models';
import { AppDatePipe } from '@msh/shared/ui-shared';
import { ActivatedRoute, Router } from '@angular/router';
import { Ripple } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { FileUploadModule } from 'primeng/fileupload';
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
    RefuseExamCopyComponent,
    CheckboxModule,
    DatePipe,
    AppDatePipe,
    Ripple,
    TableModule,
    TooltipModule,
    FileUploadModule,
  ],
  providers: [DatePipe],
  templateUrl: './exam-copy-details.component.html',
  styleUrls: ['./exam-copy-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamCopyDetailsComponent implements OnInit {
  @ViewChild('form', { static: true }) form!: NgForm;
  @Input() examCopies$: Observable<ExamCopy[]> | undefined;

  @Output() documentUploaded = new EventEmitter<boolean>();

  base64?: string;
  confirmExamCopy: ExamCopyConfirm = {
    applicationId: '',
    attachedDocument: '',
    documentName: '',
  };
  submitted = false;
  confirmModal = false;
  refuseModal = false;
  updatedFile!: File;
  examCopy: ExamCopy = {};
  applicationId = '';

  constructor(
    private cd: ChangeDetectorRef,
    private readonly examCopyService: ExamCopyApiService,
    private readonly route: ActivatedRoute,
    private readonly toastService: GlobalToastService,
    private readonly router: Router
  ) {
    this.applicationId = this.route.snapshot.params['applicationId'];
  }

  onConfirmModalClose() {
    this.confirmModal = false;
  }
  onFormClose() {
    this.confirmModal = false;
  }
  onDocumentUploaded() {
    this.documentUploaded.emit(true);
  }

  onRefuseModalClose() {
    this.refuseModal = false;
  }

  ngOnInit(): void {
    this.getDetails(this.applicationId);
  }

  onConfirm() {
    this.confirmModal = true;
  }

  onRefuse() {
    this.refuseModal = true;
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
    this.submitted = true;
    this.confirmExamCopy.applicationId = this.applicationId;
    console.log(123, this.confirmExamCopy);
    this.examCopyService
      .confirm(this.confirmExamCopy)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (!response.isSuccessful) {
          this.toastService.showError(
            response.errorMessage ?? 'Ndodhi një problem gjatë konfirmimit'
          );
        }
        if (response.isSuccessful) {
          this.toastService.showSuccess('Konfirmimi u krye me sukses');
          this.router.navigate(['/evaluations/exam-copy/list-of-exam-copies']);
        }
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
      this.confirmExamCopy.attachedDocument = this.base64;
      this.confirmExamCopy.documentName = file.name;
    };
  }
}
