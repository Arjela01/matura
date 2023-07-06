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
import { DropdownModel } from '@msh/shared/data-access-shared';
import { IDiplomaFile } from '@msh/shared/domain-models';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'msh-diplomas-student-form',
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
    MultiSelectModule,
  ],
  templateUrl: './diplomas-student-form.component.html',
  styleUrls: ['./diplomas-student-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiplomasStudentFormComponent {
  @Output() formSave = new EventEmitter<string>();
  @Output() formClose = new EventEmitter<undefined>();
  @Output() admOfficeChanged = new EventEmitter<string>();
  @Input() studentTypes: DropdownModel<number>[] = [];
  @Input() administrationOffices: DropdownModel<number>[] = [];
  @Input() highSchools: DropdownModel<number>[] = [];
  @ViewChild('form', { static: true }) form!: NgForm;

  submitted = false;

  diplomaFile: IDiplomaFile = {
    studentType: 0,
    studentId: '',
    schoolId: 0,
    isForeign: false,
    isPrinted: false,
    isProfessional: false,
    darZaId: 0,
  };
  highSchoolFiltered: DropdownModel<number>[] = [];

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private cd: ChangeDetectorRef) {}

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid && this.diplomaFile.darZaId !== 0) {
      let initialUrl = `?studentType=${this.diplomaFile.studentType}`;
      if (this.diplomaFile.schoolId !== 0) {
        initialUrl += `&schoolId=${this.diplomaFile.schoolId}`;
      }
      if (this.diplomaFile.darZaId !== 0) {
        initialUrl += `&darZaId=${this.diplomaFile.darZaId}`;
      }
      const accademicYear = JSON.parse(
        localStorage.getItem('academicYear') as any
      );
      initialUrl += `&isPrinted=${this.diplomaFile.isPrinted}&isProffesional=${this.diplomaFile.isProfessional}&isForeign=${this.diplomaFile.isForeign}&academicYearId=${accademicYear?.id}`;
      this.formSave.emit(initialUrl);
    }
  }

  onAdministrationOfficeChange($event: DropdownModel<number>) {
    if ($event.value) {
      this.admOfficeChanged.emit($event.value.toString());
    }
  }
}
