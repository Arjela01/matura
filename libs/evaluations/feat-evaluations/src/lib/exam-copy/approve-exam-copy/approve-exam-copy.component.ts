import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ExamCopyApiService } from '@msh/evaluations/data-access-evaluations';
import { ExamCopy, ExamCopyConfirm } from '@msh/evaluations/domain-evaluations';
import { GlobalToastService } from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
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
  base64?: string;

  confirmExamCopy: ExamCopyConfirm = {
    applicationId: '',
    attachedDocument: '',
    documentName: '',
  };

  examCopy?: ExamCopy | null = null;

  @ViewChild('form', { static: true }) form!: NgForm;

  @Input() set examCopyDetails(details: ExamCopy | null) {
    if (details) {
      this.examCopy = details;
    }
  }

  constructor(
    private cd: ChangeDetectorRef,
    private readonly examCopyService: ExamCopyApiService,
    private readonly toastService: GlobalToastService
  ) {}
  ngOnInit(): void {
    this.confirmExamCopy.applicationId = this.examCopy?.applicationId;
    console.log(this.confirmExamCopy);
  }

  onCancelClick() {
    window.location.reload();
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

  onConfirm() {
    this.examCopyService
      .confirm(this.confirmExamCopy)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful === false) {
          this.toastService.showError(
            response.errorMessage ?? 'Ndodhi një problem gjatë konfirmimit'
          );
        }

        if (response.isSuccessful === true) {
          this.toastService.showSuccess('Konfirmimi u krye me sukses');
          window.location.reload();
        }
        console.log(response);
      });
  }
}
