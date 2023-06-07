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
import { NgForm } from '@angular/forms';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { StudyProgram } from '@msh/shared/domain-models';

@Component({
  selector: 'msh-diplomas-student-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './diplomas-student-form.component.html',
  styleUrls: ['./diplomas-student-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiplomasStudentFormComponent {
  @Input() darZa: DropdownModel<number>[] = [];
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
