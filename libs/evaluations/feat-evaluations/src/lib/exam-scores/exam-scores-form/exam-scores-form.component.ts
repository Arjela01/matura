import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { ExamScore } from '@msh/evaluations/domain-evaluations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';

@Component({
  selector: 'msh-exam-score-form',
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
  templateUrl: './exam-scores-form.component.html',
  styleUrls: ['./exam-scores-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamScoresFormComponent implements OnChanges {
  @Input() examTypes: DropdownModel<number>[] = [];
  @Input() examSubjects: DropdownModel<string>[] = [];

  @Output() formSave = new EventEmitter<ExamScore>();
  @Output() formClose = new EventEmitter<undefined>();
  @Output() examTypeChanged = new EventEmitter<string>();
  @Output() examSubjectChanged = new EventEmitter<string>();

  @ViewChild('form', { static: true }) form!: NgForm;
  submitted = false;

  examScore: ExamScore = {
    barcode: '',
    documentName: '',
    examSecretId: '',
    id: 0,
    modificationReason: '',
    multipleChoiceScore: 0,
    academicYearId: 1,
    writingScore: 0,
  };
  examTypeId: any;
  examSubjectId: any;
  currentYear = new Date().getFullYear();

  @Input() set examScoreDetails(details: ExamScore | null) {
    if (details) {
      this.examScore = Object.assign({}, details);
    }
  }

  constructor(
    private cd: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.examTypeId = this.examScore.examTypeId;
    this.examSubjectId = this.examScore.examSubjectId;
    this.cd.detectChanges();
  }

  onCancelClick(): void {
    this.formClose.emit();
  }

  onSubmit(): void {
    this.submitted = true;
      if (this.form.valid) {
        this.formSave.emit(this.examScore);
      }
  }
  onExamTypeChanged($event: any): void {
    this.examTypeId =  $event.value
    this.examTypeChanged.emit(this.examTypeId);
    this.examScore.examTypeId = this.examTypeId;
  }

  onExamSubjectChanged($event: any): void {
    this.examSubjectId = $event.value
    this.examSubjectChanged.emit(this.examSubjectId);
    this.examScore.examSubjectId = this.examSubjectId;
  }
}
