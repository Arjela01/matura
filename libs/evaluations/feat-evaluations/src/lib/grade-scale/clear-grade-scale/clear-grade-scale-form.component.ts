import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { GradesScale } from '@msh/shared/domain-models';

@Component({
  selector: 'msh-clear-grade-scale-form',
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
  templateUrl: './clear-grade-scale-form.component.html',
  styleUrls: ['./clear-grade-scale-form.component.scss'],
})
export class ClearGradeScaleFormComponent {
  @Input() examTypesDropdown: DropdownModel<number>[] = [];
  @Output() formSave = new EventEmitter<number>();
  @Output() formClose = new EventEmitter<undefined>();
  @Output() upload = new EventEmitter<any>();
  @ViewChild('form', { static: true })
  form!: NgForm;

  submitted = false;
  displayModal = false;

  gradeScale: any = {
    examTypeId: '',
    file: '',
  };

  onCancelClick() {
    this.formClose.emit();
    this.displayModal = false;
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.gradeScale.examTypeId);
    }
  }
}
