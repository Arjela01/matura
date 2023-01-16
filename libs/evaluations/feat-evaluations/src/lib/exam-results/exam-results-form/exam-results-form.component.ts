import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, NgForm} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {InputNumberModule} from "primeng/inputnumber";
import {RadioButtonModule} from "primeng/radiobutton";
import {InputTextareaModule} from "primeng/inputtextarea";
import {ButtonModule} from "primeng/button";
import {ExamResult} from "@msh/evaluations/domain-evaluations";
import {FileUpload, FileUploadModule} from "primeng/fileupload";

@Component({
  selector: 'msh-exam-result-form',
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
  templateUrl: './exam-results-form.component.html',
  styleUrls: ['./exam-results-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamResultsFormComponent {


  @Input() set examResultDetails(details: ExamResult | null) {
    console.log(details)
    if (details) {
      this.examResult = Object.assign({}, details);
      console.log(this.examResult)
    }
  }
  @Input() examType: string | undefined;
  @Output() formSave = new EventEmitter<ExamResult>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  submitted = false;

  examResult: ExamResult = {
    id: 0,
    elaboration_points: 0,
    alternative_points: 0,
    reason: '',
    document_name: '',
  };

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.examResult);
    }
  }

  myUploader($event: any) {
    //
  }
}
