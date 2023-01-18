import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, NgForm} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {InputNumberModule} from "primeng/inputnumber";
import {RadioButtonModule} from "primeng/radiobutton";
import {InputTextareaModule} from "primeng/inputtextarea";
import {ButtonModule} from "primeng/button";
import { ExamScore} from "@msh/evaluations/domain-evaluations";
import { FileUploadModule} from "primeng/fileupload";

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
    FileUploadModule,
  ],
  templateUrl: './exam-scores-form.component.html',
  styleUrls: ['./exam-scores-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamScoresFormComponent {


  @Input() set examScoreDetails(details: ExamScore | null) {
    console.log(details)
    if (details) {
      this.examScore = Object.assign({}, details);
      console.log(this.examScore)
    }
  }
  @Input() examType: string | undefined;
  @Output() formSave = new EventEmitter<ExamScore>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  submitted = false;

  examScore: ExamScore = {
    id: 0,
    studentId: '',
    barcode: '',
    examSubjectCode : 0,
    academicYearId: 0,
    isFall: false,
    writingScore: 0,
    multipleChoiceScore: 0,
    modificationReason: '',
    documentName: ''
  };

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.examScore);
    }
  }
}
