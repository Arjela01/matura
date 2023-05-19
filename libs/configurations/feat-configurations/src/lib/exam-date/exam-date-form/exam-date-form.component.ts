import {CommonModule, formatDate} from '@angular/common';
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
import { ExamDate } from '@msh/shared/domain-models';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import {CalendarModule} from "primeng/calendar";

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
    CalendarModule,
  ],
  templateUrl: './exam-date-form.component.html',
  styleUrls: ['./exam-date-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamDateFormComponent {

  @Input() examTypes: DropdownModel<number>[] = [];
  @Input() examSites: DropdownModel<number>[] = [];
  date: any;

  @Input() set examDatesDetails(details: ExamDate | null) {
    if (details) {
      this.examDate = Object.assign({}, details);
      this.date = formatDate(new Date(this.examDate.date), 'dd/MM/yyyy', 'en');
    }
  }

  @Output() formSave = new EventEmitter<ExamDate>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', {static: true}) form!: NgForm;
  minimumDate = new Date();

  submitted = false;
  examDate: ExamDate = {
    id: '',
    date: new Date(),
    time:'',
    examTypeId:0,
    examTypeName:'',
    examSiteId:0,
    examSiteName:'',
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private cd: ChangeDetectorRef) {

  }

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.examDate.date = this.date
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.examDate);
    }
  }
  }
