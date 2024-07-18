import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {
  ExamGradeRequestModel
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
  selector: 'msh-approve-exam-grade-request',
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
  templateUrl: './approve-exam-grade-request.component.html',
  styleUrls: ['./approve-exam-grade-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApproveExamGradeRequestComponent {
  @ViewChild('form', { static: true }) form!: NgForm;
  @Input() set examGradeRequestDetails(details: ExamGradeRequestModel | null) {
    if (details) {
      this.examGradeRequest = details;
    }
  }

  @Output() formClose = new EventEmitter<undefined>();
  @Output() fileUploaded: EventEmitter<any> = new EventEmitter<any>();
  base64?: string;
  examGradeRequest?: ExamGradeRequestModel | null = null;
  displayUploadModal = false;

  onCancelClick() {
    this.formClose.emit();
    this.displayUploadModal = false;
  }

  handleUpload(data: any) {
    this.fileUploaded.emit(data);
  }

  onConfirm() {
    this.formClose.emit();
    this.displayUploadModal = false; 
  }

  onSubmit(event: Event) {
    event.preventDefault(); 
    this.onConfirm();
  }
}
