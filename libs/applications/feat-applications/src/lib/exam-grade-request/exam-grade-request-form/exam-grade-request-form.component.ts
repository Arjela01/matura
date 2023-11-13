import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { ExamGradeRequestModel } from '@msh/shared/domain-models';
import { FormsModule, NgForm } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { UntilDestroy } from '@ngneat/until-destroy';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { DropdownModule } from 'primeng/dropdown';

@UntilDestroy()
@Component({
  selector: 'msh-exam-grade-request-form',
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
    CalendarModule,
    DropdownModule,
  ],
  templateUrl: './exam-grade-request-form.component.html',
  styleUrls: ['./exam-grade-request-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamGradeRequestFormComponent {
  date: Date | null = null;
  @Input() set examGradeRequestDetails(details: ExamGradeRequestModel | null) {
    if (details) {
      this.examGradeRequest = Object.assign({}, details);
      if (details.dateOfBirth) {
        this.date = new Date(details.dateOfBirth);
      }
    }
  }
  @Input() academicYears: DropdownModel<number>[] = [];
  @Output() formSave = new EventEmitter<ExamGradeRequestModel>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  submitted = false;

  examGradeRequest: ExamGradeRequestModel = {
    dateOfBirth: '',
    firstName: '',
    id: '',
    lastName: '',
    academicYearId: 0,
    middleName: '',
  };

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.valid) {
      if (this.date) {
        const formattedDate = formatDate(this.date, 'yyyy-MM-dd', 'en-US');
        this.examGradeRequest.dateOfBirth = formattedDate;
      }
      this.formSave.emit(this.examGradeRequest);
    }
  }
}
