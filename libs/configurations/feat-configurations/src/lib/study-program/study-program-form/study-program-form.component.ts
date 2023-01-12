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
export class StudyProgramFormComponent implements OnChanges {
  @Input() universities: DropdownModel<number>[] = [];
  @Input() universityDepartaments: DropdownModel<number>[] = [];
  @Input() academicYears: DropdownModel<number>[] = [];

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
    academicYearId: 0,
    code: '',
    isTwoYearLong: 1,
    isValidForRace: true,
    isWithCompetition: true,
    maturaCoefficient: 0,
    minAverageGrade: 0,
    quota: 0,
    studentScores: 0,
    universityId: 0,
    universityDepartmentId: 0,
    usedQuota: 0,
    competitionCoefficient: 0,
    competitionMaxScore: 0,
    competitionMinScore: 0,
    dropDownName: 'ssss',
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private cd: ChangeDetectorRef) {}

  ngOnChanges(): void {
    // if (this.universityDepartaments && this.studyProgram.university) {
    //   this.onUniversityChange({ value: this.studyProgram.university });
    // }
    console.log('test');
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

  // onUniversityChange($event: any) {
  //   console.log($event.value);
  //   console.log(this.universityDepartaments);
  //   this.universityDepartmentsFiltered = this.universityDepartaments;
  //   console.log(this.universityDepartmentsFiltered);
  // }
}
