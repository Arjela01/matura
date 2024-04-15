import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ExamQuestionModel } from '@msh/shared/domain-models';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'msh-exam-question-form',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule,
    InputTextModule,
    RadioButtonModule,
  ],
  templateUrl: './exam-questions-form.component.html',
  styleUrls: ['./exam-questions-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamQuestionsFormComponent {
  @Input() set examQuestionDetails(details: ExamQuestionModel | null) {
    if (details) {
      this.examQuestion = Object.assign({}, details);
    }
  }

  @Output() formSave = new EventEmitter<ExamQuestionModel>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;
  @ViewChild('indexInputField', { static: false }) indexInputField:
    | ElementRef<HTMLInputElement>
    | undefined;

  submitted = false;

  examQuestion: ExamQuestionModel = {
    examVariantAcademicYear: '',
    examVariantExamSubjectName: '',
    examVariantID: 0,
    examVariantMaximumScore: 0,
    examVariantName: '',
    examVariantProfileGroupName: '',
    examVariantProfileName: '',
    id: 0,
    index: 0,
    questionMaximumScore: 0,
    section: '',
  };

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    if (this.form.valid) {
      this.formSave.emit(this.examQuestion);
    }
    if (this.indexInputField && this.indexInputField.nativeElement) {
      this.indexInputField.nativeElement.focus();
    }
  }
}
