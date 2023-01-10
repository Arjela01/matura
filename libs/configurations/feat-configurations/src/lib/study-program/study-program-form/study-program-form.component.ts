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
import { StudyProgram } from '@msh/configurations/domain-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'msh-study-program-form',
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
  templateUrl: './study-program-form.component.html',
  styleUrls: ['./study-program-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudyProgramFormComponent {
  @Input() universities: DropdownModel<number>[] = [];
  @Input() universityDepartaments: DropdownModel<number>[] = [];

  @Input() set studyProgramDetails(details: StudyProgram | null) {
    if (details) {
      this.studyProgram = Object.assign({}, details);
    }
  }
  @Output() formSave = new EventEmitter<StudyProgram>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  submitted = false;

  studyProgram: StudyProgram = {
    id: 0,
    name: '',
    academicYear: 0,
    code: '',
    fullName: '',
    isTwoYearLong: 1,
    isValidForRace: true,
    isWithCompetition: true,
    maturaCoefficient: 0,
    minAverageGrade: 0,
    quota: 0,
    studentScores: 0,
    university: 1,
    universityDepartament: 1,
    usedQuota: 0,
    competitionCoefficient: 0,
    competitionMaxScore: 0,
    competitionMinScore: 0,
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private cd: ChangeDetectorRef) {}

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.studyProgram);
    }
  }
}
