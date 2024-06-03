import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ExamSubjectGroup } from '@msh/shared/domain-models';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'msh-exam-subject-group-form',
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
  templateUrl: './exam-subject-group-form.component.html',
  styleUrls: ['./exam-subject-group-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamSubjectGroupFormComponent {
  @ViewChild('form', { static: true }) form!: NgForm;
  @Input() examSubjects: DropdownModel<string>[] = [];
  @Input() set examSubjectGroupDetails(details: ExamSubjectGroup | null) {
    if (details) {
      this.examSubjectGroup = Object.assign({}, details);
    }
  }

  @Output() formSave = new EventEmitter<ExamSubjectGroup>();
  @Output() formClose = new EventEmitter<undefined>();

  submitted = false;
  examSubjectGroup: ExamSubjectGroup = <ExamSubjectGroup>{};

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.examSubjectGroup);
    }
  }
}
