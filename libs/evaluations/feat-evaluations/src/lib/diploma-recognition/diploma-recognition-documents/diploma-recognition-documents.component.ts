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
import {
  DiplomaRecognitionDocuments,
  ExamAssignment,
  Student,
} from '@msh/shared/domain-models';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DialogModule } from 'primeng/dialog';
import { UntilDestroy } from '@ngneat/until-destroy';
import { TableLazyLoadEvent } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';

@UntilDestroy()
@Component({
  selector: 'msh-diploma-recognition-documents',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    RadioButtonModule,
    InputTextareaModule,
    ButtonModule,
    CheckboxModule,
    DropdownModule,
    DialogModule,
    FileUploadModule,
  ],
  templateUrl: './diploma-recognition-documents.component.html',
  styleUrls: ['./diploma-recognition-documents.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiplomaRecognitionDocumentsComponent {
  @Input() set responseDocumentsDetails(details: any | null) {
    if (details) {
      this.diplomaRecognitionDocuments = Object.assign({}, details);
    }
  }
  @Input() isResponseModal = false;
  @Input() isRequestModal = false;
  @Input() diplomaRecognitionId!: number;

  @Output() formSave = new EventEmitter<DiplomaRecognitionDocuments>();
  @Output() formClose = new EventEmitter<undefined>();
  @Output() lazyLoadData = new EventEmitter<TableLazyLoadEvent>();

  @ViewChild('form', { static: true }) form!: NgForm;
  filters: TableLazyLoadEvent | null = null;
  submitted = false;
  displayUploadModal = false;

  diplomaRecognitionDocuments: DiplomaRecognitionDocuments =
    {} as DiplomaRecognitionDocuments;
  uploaded = false;

  onCancelClick() {
    this.formClose.emit();
    this.displayUploadModal = false;
  }

  onSubmit() {
    this.submitted = true;
    this.diplomaRecognitionDocuments.requestId = this.diplomaRecognitionId;
    this.formSave.emit(this.diplomaRecognitionDocuments);
  }

  loadRows($event: TableLazyLoadEvent) {
    this.lazyLoadData.emit($event);
  }

  onUpload(event: any) {
    for (const file of event.files) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        if (fileReader.result) {
          const parts = fileReader.result.toString().split(';base64,');
          const parsedBase64 = parts[1];
          if (!this.diplomaRecognitionDocuments.files) {
            this.diplomaRecognitionDocuments.files = [];
          }
          this.diplomaRecognitionDocuments.files.push({
            data: parsedBase64,
            fileName: file.name,
            mimeType: file.type,
          });
          this.uploaded = true;
        }
      };
    }
  }
}
