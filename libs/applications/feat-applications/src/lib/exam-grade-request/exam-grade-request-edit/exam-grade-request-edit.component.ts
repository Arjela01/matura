import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ExamGradeRequestModel } from '@msh/shared/domain-models';
import { AppDatePipe } from '@msh/shared/ui-shared';
import { UntilDestroy } from '@ngneat/until-destroy';
import * as FileSaver from 'file-saver';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { Ripple } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ApproveExamGradeRequestComponent } from '../approve-exam-grade-request/approve-exam-grade-request.component';

@UntilDestroy()
@Component({
  selector: 'msh-exam-grade-request-edit',
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
    CalendarModule,
    DropdownModule,
    RouterLink,
    TableModule,
    FileUploadModule,
    DialogModule,
    ApproveExamGradeRequestComponent,
    DatePipe,
    AppDatePipe,
    Ripple,
    TooltipModule
  ],
  templateUrl: './exam-grade-request-edit.component.html',
  styleUrls: ['./exam-grade-request-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamGradeRequestEditComponent implements OnInit {
  ngOnInit(): void {
    console.log('ExamGradeRequest: ' + this.examGradeRequest)
  }

  @Input() examGradeRequest: ExamGradeRequestModel = {
    academicYearId: 0,
    dateOfBirth: '',
    description: '',
    examGradesRequestStatusId: 0,
    examGradesRequestStatusName: '',
    firstName: '',
    id: '',
    idCard: '',
    lastName: '',
    maturaId: '',
    middleName: '',
    highSchoolId: '',
    email: '',
    attachedDocument: '',
    isQueued: false,
    isQueueReady: false
  };
  @Input() academicYears: DropdownModel<number>[] = [];
  @Input() highSchool: DropdownModel<number>[] = [];
  @Input() examGradeRequestStatus: DropdownModel<string>[] = [];
  @Output() formSave = new EventEmitter<ExamGradeRequestModel>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  
  submitted = false;
  base64?: string;
  confirmModal = false;

  onSubmit() {
    this.submitted = true;

    if (this.form.valid) {
      this.formSave.emit(this.examGradeRequest);
    }
  }

  onFormClose() {
    this.confirmModal = false;
  }

  onConfirm() {
    this.confirmModal = true;
  }

  onFileUploaded(data: any) {
    this.handleUpload(data);
  }

  handleUpload(data: any) {
    const file = data.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      this.base64 = base64.split(',')[1];
      this.examGradeRequest.attachedDocument = this.base64;
      this.examGradeRequest.documentName = file.name;
    };
  }

  downloadFile(document: any) {
    const blob = this.dataURItoBlob(document);
    const file = new File([blob], this.examGradeRequest.documentName ?? 'document');
    FileSaver.saveAs(file, this.examGradeRequest.documentName);
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
}
