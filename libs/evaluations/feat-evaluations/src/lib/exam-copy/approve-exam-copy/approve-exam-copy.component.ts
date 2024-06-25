import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {
  ExamAssignment,
  ExamCopy,
  ExamCopyUpdate,
} from '@msh/shared/domain-models';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';

@UntilDestroy()
@Component({
  selector: 'msh-approve-exam-copy',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    RadioButtonModule,
    DropdownModule,
    FileUploadModule,
    InputTextareaModule,
    ButtonModule,
    DropdownModule,
  ],
  templateUrl: './approve-exam-copy.component.html',
  styleUrls: ['./approve-exam-copy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApproveExamCopyComponent implements OnInit {
  @ViewChild('form', { static: true }) form!: NgForm;
  @Input() set examCopyDetails(details: ExamCopy | null) {
    if (details) {
      this.examCopy = details;
    }
  }

  @Output() formClose = new EventEmitter<undefined>();
  @Output() fileUploaded: EventEmitter<File> = new EventEmitter<File>();
  base64?: string;
  updateExamCopy: ExamCopyUpdate = {
    applicationId: '',
    attachedDocument: '',
    documentName: '',
  };
  examCopy?: ExamCopy | null = null;
  displayUploadModal = false;

  ngOnInit(): void {
    this.updateExamCopy.applicationId = this.examCopy?.applicationId;
  }

  onCancelClick() {
    this.formClose.emit();
    this.displayUploadModal = false;
  }

  handleUpload(data: any) {
    const file = data.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      this.base64 = base64.split(',')[1];
      this.updateExamCopy.attachedDocument = this.base64;
      this.updateExamCopy.documentName = file.name;
      this.fileUploaded.emit(file);
    };
  }

  onConfirm() {
    this.formClose.emit();
    this.displayUploadModal = false; // Close the modal after saving the form
  }

  onSubmit(event: Event) {
    event.preventDefault(); // Prevent default form submission
    this.onConfirm();
  }
}
