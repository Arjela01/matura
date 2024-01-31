import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManualExamGradeModel } from '@msh/shared/domain-models';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { FormsModule, NgForm } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { UntilDestroy } from '@ngneat/until-destroy';
import { RadioButtonModule } from 'primeng/radiobutton';

@UntilDestroy()
@Component({
  selector: 'msh-manual-exam-grade-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    DropdownModule,
    RadioButtonModule,
  ],
  templateUrl: './manual-exam-grade-form.component.html',
  styleUrls: ['./manual-exam-grade-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManualExamGradeFormComponent {
  @Input() set examGradeDetails(details: ManualExamGradeModel | null) {
    if (details) {
      this.manualExamGrade = Object.assign({}, details);
    }
  }
  @Input() examSubjects: DropdownModel<string>[] = [];

  @Output() formSave = new EventEmitter<ManualExamGradeModel>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  submitted = false;

  manualExamGrade: ManualExamGradeModel = {
    examSubjectId: '',
    examSubjectName: '',
    id: '',
    grade: 0,
    isManualEntry: false,
  };

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.valid) {
      this.formSave.emit(this.manualExamGrade);
    }
  }
}
