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
import { ExamDate } from '@msh/configurations/domain-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'msh-exam-date-form',
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
  templateUrl: './exam-date-form.component.html',
  styleUrls: ['./exam-date-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamDateFormComponent {
  @Input() examTypes: DropdownModel<number>[] = [];
  @Input() examSites: DropdownModel<number>[] = [];

  @Input() set examDatesDetails(details: ExamDate | null) {
    if (details) {
      console.log(details)
      this.examDate = Object.assign({}, details);

      console.log(this.examDate)
      if (this.examDate.id) {
        this.dateVal = new Date(this.examDate.dateTime);
        console.log(this.dateVal)
        this.timeVal = new Date(this.examDate.dateTime).getHours() + ':' + new Date(this.examDate.dateTime).getMinutes();
      }
    }
  }

  @Output() formSave = new EventEmitter<ExamDate>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', {static: true}) form!: NgForm;

  submitted = false;
  examDate: ExamDate = {
    id: '',
    dateTime: '',
    examTypeId:0,
    examTypeName:'',
    examSiteId:0,
    examSiteName:'',
  };

  dateVal!: Date;
  timeVal!: string;


  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private cd: ChangeDetectorRef) {


  }

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.valid) {
      const timeString = this.timeVal + ':00';
      const dateObj = new Date(this.dateVal + ' ' + timeString);
      this.examDate.dateTime = dateObj;
      this.formSave.emit(this.examDate);

    }
  }
  }
