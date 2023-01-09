import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {DropdownModel} from "@msh/shared/data-access-shared";
import {ExamVersion} from "@msh/configurations/domain-configurations";
import {FormsModule, NgForm} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {InputNumberModule} from "primeng/inputnumber";
import {RadioButtonModule} from "primeng/radiobutton";
import {InputTextareaModule} from "primeng/inputtextarea";
import {ButtonModule} from "primeng/button";
import {CheckboxModule} from "primeng/checkbox";

@Component({
  selector: 'msh-exam-version-form',
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
  ],
  templateUrl: './exam-version-form.component.html',
  styleUrls: ['./exam-version-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamVersionFormComponent {

  @Input() set examVersionDetails(details: ExamVersion | null) {
    if (details) {
      this.examVersion = Object.assign({}, details);
    }
  }
  @Output() formSave = new EventEmitter<ExamVersion>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  citiesFiltered: DropdownModel<number>[] = [];

  submitted = false;

  examVersion: ExamVersion = {
    id: 0,
    name: '',
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private cd: ChangeDetectorRef) {}


  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.examVersion);
    }
  }
}
