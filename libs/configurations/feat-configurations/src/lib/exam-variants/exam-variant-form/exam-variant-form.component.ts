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
import { DropdownModel } from '@msh/shared/data-access-shared';
import { AcademicYear, ExamVariant } from '@msh/shared/domain-models';
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
export class ExamVariantFormComponent{
  @Input() examTypes: DropdownModel<number>[] = [];
  @Input() examSubjects: DropdownModel<string>[] = [];
  @Input() profileGroups: DropdownModel<number>[] = [];
  @Input() profiles: DropdownModel<number>[] = [];
  @Input() academicYears: DropdownModel<any>[] = []
  @Input() academicYear: Partial<AcademicYear> | null = null;
  @Input() set examVariantDetails(details: ExamVariant | null) {
    if (details) {
      this.examVariant = Object.assign({}, details);
    }
  }

  @Output() formSave = new EventEmitter<ExamVariant>();
  @Output() formClose = new EventEmitter<undefined>();
  @Output() loadExamSubjects = new EventEmitter<ExamVariant>();
  @ViewChild('form', { static: true }) form!: NgForm;
  examTypesFiltered: DropdownModel<number>[] = [];
  examType:any = null;
  submitted = false;

  examVariant: ExamVariant = {
    name: '',
    numberOfQuestions: 0,
    profileGroupId:null,
    profileId:0,
    maximumScore:0,
    examVariantAcademicYearId:0,
    examSubjectId:'',
    examTypeId:0,

  };
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ngOnChanges(): void {
    if (this.profileGroups && this.examVariant.examTypeId) {
      this.onExamTypeChange({ value: this.examType });
    }
  }

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.examVariant.examVariantAcademicYearId = this.academicYear?.id;
      this.formSave.emit(this.examVariant);
    }
  }

  onExamTypeChange($event: any) {
    this.examTypesFiltered = this.examTypes.filter(
      e => e.parentKey == $event.value
    );
  }

  refreshExamSubjects() {
    this.loadExamSubjects.emit(Object.assign({}, this.examVariant));
  }
}
