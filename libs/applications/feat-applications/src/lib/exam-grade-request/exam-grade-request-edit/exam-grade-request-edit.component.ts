import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
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
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ExamGradeRequestService } from '@msh/applications/data-access-applications';
import { AcademicYearApiService } from '@msh/configurations/data-access-configurations';

@UntilDestroy()
@Component({
  selector: 'msh-exam-grade-request-edit',
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
    RouterLink,
  ],
  templateUrl: './exam-grade-request-edit.component.html',
  styleUrls: ['./exam-grade-request-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamGradeRequestEditComponent {
  @Input() examGradeRequest: ExamGradeRequestModel = {
    academicYearId: 0,
    dateOfBirth: '',
    description: '',
    examGradesRequestStatusId: 0,
    examGradesRequestStatusName: '',
    firstName: '',
    id: '',
    idCard: '',
    lastName: '',
    maturaId: '',
    middleName: '',
  };
  @Input() academicYears: DropdownModel<number>[] = [];
  @Input() examGradeRequestStatus: DropdownModel<string>[] = [];
  @Output() formSave = new EventEmitter<ExamGradeRequestModel>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  submitted = false;

  onSubmit() {
    this.submitted = true;

    if (this.form.valid) {
      this.formSave.emit(this.examGradeRequest);
    }
  }
}
