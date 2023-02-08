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
import { GradesScale } from '@msh/evaluations/domain-evaluations';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'msh-grade-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    RadioButtonModule,
    InputTextareaModule,
    ButtonModule,
  ],
  templateUrl: './grade-form.component.html',
  styleUrls: ['./grade-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GradeModalFormComponent {
  @Input() set gradesDetails(details: GradesScale | null) {
    if (details) {
      this.gradeScale = Object.assign({}, details);
    }
  }
  @Output() formSave = new EventEmitter<GradesScale>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  submitted = false;

  gradeScale: GradesScale = {
    grade: 0,
    score: 0,
    examSubjectId: '',
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private cd: ChangeDetectorRef) {}

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.gradeScale);
    }
  }
}
