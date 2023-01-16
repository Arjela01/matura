import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { StudySubject } from '@msh/configurations/domain-configurations';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  selector: 'msh-study-subject-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    InputTextareaModule,
  ],
  templateUrl: './study-subject-form.component.html',
  styleUrls: ['./study-subject-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudySubjectFormComponent {
  @Output() formSave = new EventEmitter<StudySubject>();
  @Output() formClose = new EventEmitter<undefined>();

  @Input() set studySubjectDetails(details: StudySubject | null) {
    if (details) {
      this.studySubject = Object.assign({}, details);
    }
  }

  @ViewChild('form', { static: true }) form!: NgForm;
  submitted = false;

  studySubject: StudySubject = {
    id: 0,
    code: '',
    name: '',
  };

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.studySubject);
    }
  }
}
