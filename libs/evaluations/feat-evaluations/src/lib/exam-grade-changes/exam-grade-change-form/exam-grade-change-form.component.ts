import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { StudentsApiService } from '@msh/configurations/data-access-configurations';
import { SharedStudentLookupModule } from '@msh/shared/student-lookup';
import { TooltipModule } from 'primeng/tooltip';
import { ExamGradeChange } from '@msh/shared/domain-models';

@UntilDestroy()
@Component({
  selector: 'msh-exam-grade-change-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    RadioButtonModule,
    InputTextareaModule,
    ButtonModule,
    DropdownModule,
    AutoCompleteModule,
    DialogModule,
    SharedStudentLookupModule,
    TooltipModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './exam-grade-change-form.component.html',
  styleUrls: ['./exam-grade-change-form.component.scss'],
})
export class ExamGradeChangeFormComponent {
  @Input() examGradeChangeTypes: DropdownModel<number>[] = [];
  @Input() examSubjects: DropdownModel<string>[] = [];

  @Output() formSave = new EventEmitter<ExamGradeChange>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  submitted = false;
  examSecret: ExamGradeChange = {};

  constructor(
    private readonly studentService: StudentsApiService,
    private readonly cd: ChangeDetectorRef
  ) {}


  onExitForm() {
    this.formClose.emit();
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.examSecret);
    }
  }
}
