import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { GradesScale } from '@msh/evaluations/domain-evaluations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'msh-upload-grade-scale-form',
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
  templateUrl: './upload-grade-scale-form.component.html',
  styleUrls: ['./upload-grade-scale-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadGradeScaleFormComponent {
  base64?: string;
  @Input() set gradesDetails(details: GradesScale | null) {
    if (details) {
      this.gradeScale = Object.assign({}, details);
    }
  }
  @Input() examSubjectsDropdown: DropdownModel<number>[] = [];
  @Output() formSave = new EventEmitter<GradesScale>();
  @Output() formClose = new EventEmitter<undefined>();
  @Output() upload = new EventEmitter<any>();
  @ViewChild('form', { static: true })
  form!: NgForm;

  submitted = false;

  gradeScale: any = {
    examSubjectId: '',
    file: '',
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private cd: ChangeDetectorRef) {}

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit(data: any) {
    this.submitted = true;
    const file = data.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      this.base64 = base64.split(',')[1];
      this.submitted = true;
      if (
        this.gradeScale.examSubjectId !== '' &&
        this.gradeScale.examSubjectId
      ) {
        this.upload.emit({
          file: this.base64,
          examSubjectId: this.gradeScale.examSubjectId,
        });
      }
    };
  }
}
