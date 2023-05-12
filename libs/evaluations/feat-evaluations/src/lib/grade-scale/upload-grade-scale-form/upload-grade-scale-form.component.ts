import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {
  GradesScale,
} from '@msh/evaluations/domain-evaluations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { GradesScaleService } from '@msh/evaluations/data-access-evaluations';
import { Router } from '@angular/router';
import { GlobalToastService } from '@msh/shared/util-shared';

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
  displayModal = false;
  examSubjectDropdown: DropdownModel<number>[] = [];

  gradeScale: any = {
    examSubjectId: '',
    file: '',
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    private readonly cd: ChangeDetectorRef,
    private readonly gradesScaleApiService: GradesScaleService,
    private readonly router: Router,
    private readonly toastService: GlobalToastService,
  ) {}

  onCancelClick() {
    this.formClose.emit();
    this.displayModal = false;
  }

  onSubmit() {
    this.submitted = true;
    this.gradeScale.file = this.base64
    this.gradesScaleApiService.uploadExcelFile(this.gradeScale).subscribe({
      next: (response: any) => {
        this.displayModal = false;

        if (response.isSuccessful) {
          this.toastService.showSuccess('Dokumenti u shtua me sukses!');
          this.formClose.emit();
          this.displayModal = false;
        } else {
          !response.errorMessage
            ? this.toastService.showError(
                'Ndodhi një problem gjatë ngarkimit të dokumentit!'
              )
            : this.toastService.showError(response.errorMessage);
        }
        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ngarkimit të dokumentit!'
          );
      },
      error: error => {
        error.errorMessage
          ? this.toastService.showError(error.errorMessage)
          : this.toastService.showError(
              'Ndodhi një problem gjatë ndryshimit të përshkallëzimit!'
            );
        this.toastService.showError(
          'Ndodhi një problem gjatë ndryshimit të përshkallëzimit!'
        );
      },
    });
  }

  onUpload(data: any) {
    const file = data.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      this.base64 = base64.split(',')[1];
      if (
        this.gradeScale.examSubjectId !== '' &&
        this.gradeScale.examSubjectId
      ) {
        this.upload.emit({
          file: this.base64,
          examSubjectId: this.gradeScale.examSubjectId,
        });
        this.cd.markForCheck();
      }
    };
  }
}
