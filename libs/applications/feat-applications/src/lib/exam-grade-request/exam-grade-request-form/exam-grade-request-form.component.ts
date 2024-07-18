import { CommonModule, formatDate } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ExamGradeRequestModel } from '@msh/shared/domain-models';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';

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
  @Input() highSchools: DropdownModel<number>[] = [];
  @Output() formSave = new EventEmitter<ExamGradeRequestModel>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  submitted = false;

  examGradeRequest: ExamGradeRequestModel = {
    examGradesRequestStatusId: 0,
    examGradesRequestStatusName: '',
    idCard: '',
    dateOfBirth: '',
    firstName: '',
    id: '',
    lastName: '',
    academicYearId: 0,
    middleName: '',
    description: '',
    maturaId: '',
    email: '',
    highSchoolId: '',
    isQueued: false,
    isQueueReady: false
  };

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.valid) {
      if (this.date) {
        this.examGradeRequest.dateOfBirth = formatDate(
          this.date,
          'yyyy-MM-dd',
          'en-US'
        );
      }
      this.formSave.emit(this.examGradeRequest);
    }
  }
}
