import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ExamSubjectProfile } from '@msh/configurations/domain-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'msh-exam-subject-profile-form',
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
  ],
  templateUrl: './exam-subject-profile-form.component.html',
  styleUrls: ['./exam-subject-profile-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamSubjectProfileFormComponent implements OnChanges {
  @Input() examTypes: DropdownModel<number>[] = [];
  @Input() academicYears: DropdownModel<number>[] = [];
  @Input() examSubjects: DropdownModel<string>[] = [];
  @Input() profiles: DropdownModel<number>[] = [];

  @Input() set examSubjectDetails(details: ExamSubjectProfile | null) {
    if (details) {
      this.examSubjectProfile = Object.assign({}, details);
    }
  }
  @Output() formSave = new EventEmitter<ExamSubjectProfile>();
  @Output() formClose = new EventEmitter<undefined>();

  @Output() loadExamSubjects = new EventEmitter<ExamSubjectProfile>();

  @ViewChild('form', { static: true }) form!: NgForm;

  examTypesFiltered: DropdownModel<number>[] = [];

  submitted = false;

  examSubjectProfile: ExamSubjectProfile = {
    examSubjectId: undefined,
    examSubjectName: undefined,
    id: undefined,
    name: '',
    code: '',
    credits: 0,
    isOptional: false,
  };

  ngOnChanges(): void {
    if (this.examTypes && this.examSubjectProfile.academicYearId) {
      this.onAcademicYearChange({
        value: this.examSubjectProfile.academicYearId,
      });
    }
  }
  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.examSubjectProfile);
    }
  }

  onAcademicYearChange($event: any) {
    this.examTypesFiltered = this.examTypes.filter(
      et => et.parentKey == $event.value
    );
  }

  refreshExamSubjects() {
    this.loadExamSubjects.emit(Object.assign({}, this.examSubjectProfile));
  }
}
