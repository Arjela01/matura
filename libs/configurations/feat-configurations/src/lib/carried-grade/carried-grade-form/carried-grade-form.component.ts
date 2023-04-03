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
import { CarriedGrade } from '@msh/applications/domain-application';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'msh-carried-grade-form',
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
    FileUploadModule,
  ],
  templateUrl: './carried-grade-form.component.html',
  styleUrls: ['./carried-grade-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarriedGradesFormComponent {
  @Input() set gradeDetails(details: CarriedGrade | null) {
    if (details) {
      this.grades = Object.assign({}, details);
    }
  }

  @Input() examTypeDropdown: DropdownModel<number>[] = [];

  @Output() formSave = new EventEmitter<CarriedGrade>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  submitted = false;

  grades: CarriedGrade = {
    id: 0,
    nid: '',
    examTypeId: 0,
    examSubject: '',
    grade: 0,
    year: 0,
    examTypeName: '',
    document: '',
  };

  uploaded = false;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private cd: ChangeDetectorRef) {}

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.grades);
    }
  }

  selectFiles(event: { files: File[] }) {
    const fileReader = new FileReader();
    for (const file of event.files) {
      fileReader.readAsDataURL(file);
      this.uploaded = true;
      fileReader.onload = () => {
        if (fileReader.result) {
          const parts = fileReader.result.toString().split(';base64,');
          this.grades.document = parts[1] as string;
        }
      };
    }
  }
}
