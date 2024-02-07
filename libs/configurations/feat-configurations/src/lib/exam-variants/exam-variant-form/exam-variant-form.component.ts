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
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ExamVariant } from '@msh/shared/domain-models';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'msh-exam-variant-form',
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
  templateUrl: './exam-variant-form.component.html',
  styleUrls: ['./exam-variant-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamVariantFormComponent {
  @Input() examTypes: DropdownModel<number>[] = [];
  @Input() examSubjects: DropdownModel<string>[] = [];
  @Input() profileGroups: DropdownModel<number>[] = [];

  @Input() set examVariantDetails(details: ExamVariant | null) {
    if (details) {
      this.examVariant = Object.assign({}, details);
    }
  }

  @Output() formSave = new EventEmitter<ExamVariant>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  examTypesFiltered: DropdownModel<number>[] = [];

  submitted = false;

  examVariant: ExamVariant = {
    id: '',
    name: '',
    numberOfQuestions: 0,
    variant: '',
    code: '',
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private cd: ChangeDetectorRef) { }

  ngOnChanges(): void {
    if (this.profileGroups && this.examVariant.examTypeId) {
      this.onExamTypeChange({ value: this.examVariant.examTypeId });
    }
  }

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.examVariant);
    }
  }

  onExamTypeChange($event: any) {
    this.examTypesFiltered = this.examTypes.filter(
      e => e.parentKey == $event.value
    );
  }
}
