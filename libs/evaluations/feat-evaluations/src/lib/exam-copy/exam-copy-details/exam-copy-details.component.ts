import { CommonModule } from '@angular/common';
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
import { TableLazyLoadEvent } from 'primeng/table';
import { Observable } from 'rxjs';
import { ExamCopy } from '@msh/shared/domain-models';

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
  ],
  templateUrl: './exam-copy-details.component.html',
  styleUrls: ['./exam-copy-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamCopyDetailsComponent implements OnInit {
  @Input() examCopies$: Observable<ExamCopy[]> | undefined;
  submitted = false;

  confirmModal = false;
  refuseModal = false;
  updatedFile!: File;

  examCopy: ExamCopy = {
    dateCreated: undefined,
    address: undefined,
    decisionDueDate: undefined,
    administrationOffice: undefined,
    city: undefined,
    applicationId: undefined,
    attachedDocument: undefined,
    cel: undefined,
    comments: undefined,
    dateOfBirth: undefined,
    decisionDate: undefined,
    documentName: undefined,
    email: undefined,
    fatherName: undefined,
    firstName: undefined,
    gender: undefined,
    lastName: undefined,
    maturaId: undefined,
    municipalityUnit: undefined,
    nationality: undefined,
    nid: undefined,
    placeOfBirth: undefined,
    postalCode: undefined,
    region: undefined,
    remarks: undefined,
    schoolCode: undefined,
    schoolName: undefined,
    service: undefined,
    status: undefined,
    subject: undefined,
    telFix: undefined,
  };

  @Input() set examCopyDetails(details: ExamCopy | null) {
    if (details) {
      this.examCopy = Object.assign({}, details);
    }
  }
  @Output() formSave = new EventEmitter<ExamCopy>();
  @Output() formClose = new EventEmitter<undefined>();
  @Output() documentUploaded = new EventEmitter<boolean>();

  @ViewChild('form', { static: true }) form!: NgForm;

  constructor(
    private cd: ChangeDetectorRef,
    private readonly examCopyService: ExamCopyApiService
  ) {}

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
    if (this.examCopy.applicationId) {
      this.getDetails(this.examCopy.applicationId);
    }
  }

  onCancelClick() {
    this.formClose.emit();
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
    if (this.form.valid) {
      this.formSave.emit(this.examCopy);
    }
  }

  onFileUploaded(file: File) {
    this.updatedFile = file;
    this.examCopy.documentName = this.updatedFile ? this.updatedFile.name : '';
  }
}
