import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DropdownModel} from "@msh/shared/data-access-shared";
import {ExamVersion} from "@msh/configurations/domain-configurations";
import {FormsModule, NgForm} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {InputNumberModule} from "primeng/inputnumber";
import {RadioButtonModule} from "primeng/radiobutton";
import {InputTextareaModule} from "primeng/inputtextarea";
import {ButtonModule} from "primeng/button";
import {CheckboxModule} from "primeng/checkbox";
import {DropdownModule} from "primeng/dropdown";

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
    DropdownModule,

  ],
  templateUrl: './exam-version-form.component.html',
  styleUrls: ['./exam-version-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamVersionFormComponent {
  @Input() examTypes: DropdownModel<number>[] = [];
  @Input() profileGroups: DropdownModel<number>[] = [];

  @Input() set examVersionDetails(details: ExamVersion | null) {
    if (details) {
      this.examVersion = Object.assign({}, details);
    }
  }

  @Output() formSave = new EventEmitter<ExamVersion>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', {static: true}) form!: NgForm;

  examTypesFiltered: DropdownModel<number>[] = [];

  submitted = false;

  examVersion: ExamVersion = {
    id: '',
    name: '',
    numberOfQuestions: 0,
    variant: ''
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnChanges(): void {
    if (this.profileGroups && this.examVersion.examTypeId) {
      this.onExamTypeChange({value: this.examVersion.examTypeId});
    }
  }

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.examVersion);
    }
  }

  onExamTypeChange($event: any) {
    this.examTypesFiltered = this.examTypes.filter(e => e.parentKey == $event.value);
  }
}
