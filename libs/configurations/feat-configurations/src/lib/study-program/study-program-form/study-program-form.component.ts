import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { StudyProgram } from '@msh/shared/domain-models';
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
export class StudyProgramFormComponent implements OnChanges {
  @Input() universities: DropdownModel<number>[] = [];
  @Input() universityDepartments: DropdownModel<number>[] = [];

  universityDepartmentsFiltered: DropdownModel<number>[] = [];

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
    code: '',
    isTwoYearLong: 1,
    isValidForRace: true,
    isWithCompetition: true,
    maturaCoefficient: '',
    minAverageGrade: '',
    quota: '',
    studentScores: '',
    universityId: '',
    universityDepartmentId: '',
    usedQuota: '',
    competitionCoefficient: '',
    competitionMaxScore: '',
    competitionMinScore: '',
    academicYearId: 1,
    dropDownName: 'ssss',
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private cd: ChangeDetectorRef) {}

  ngOnChanges(): void {
    this.onUniversityChange({ value: this.studyProgram.universityId });
    console.log(this.studyProgram.universityId);
  }

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.studyProgram);
    }
  }

  onUniversityChange($event: any) {
    this.universityDepartmentsFiltered = this.universityDepartments.filter(
      x => x.parentKey == $event.value
    );
  }
}
