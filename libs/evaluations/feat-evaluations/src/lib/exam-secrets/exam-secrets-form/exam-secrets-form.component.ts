import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input, OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, NgForm} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {InputNumberModule} from 'primeng/inputnumber';
import {RadioButtonModule} from 'primeng/radiobutton';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {ButtonModule} from 'primeng/button';
import {ExamSecret} from '@msh/evaluations/domain-evaluations';
import {DropdownModel} from '@msh/shared/data-access-shared';
import {DropdownModule} from 'primeng/dropdown';
import {AutoCompleteModule} from 'primeng/autocomplete';

@Component({
  selector: 'msh-exam-secret-form',
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
  ],
  templateUrl: './exam-secrets-form.component.html',
  styleUrls: ['./exam-secrets-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamSecretsFormComponent implements OnChanges {
  @Input() academicYears: DropdownModel<number>[] = [];

  @Output() formSave = new EventEmitter<ExamSecret>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;
  submitted = false;

  examSecret: ExamSecret = {
    id: '',
    studentId: '',
    studentName: '',
    examVersionId: '',
    examVersionName: '',
    academicYearId: 0,
    academicYear: '',
    barcode: '',
    isFall: true
  };
  examTypeId: any;
  examSubjectId: any;

  @Input() set examScoreDetails(details: ExamSecret | null) {
    if (details) {
      this.examSecret = Object.assign({}, details);
    }
  }

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {

    this.cd.detectChanges();
  }

  onCancelClick(): void {
    this.formClose.emit();
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.examSecret);
    }
  }
}
