import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges, OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { InputMaskModule } from 'primeng/inputmask';
import {
  AcademicYearApiService,
  GendersApiService,
  HighSchoolApiService,
  ProfileApiService,
  StudentsApiService,
} from '@msh/configurations/data-access-configurations';
import {
  Student,
  StudentClassModel,
  StudentSectionModel,
} from '@msh/configurations/domain-configurations';
import { Router } from '@angular/router';

@Component({
  selector: 'msh-students-form',
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
    CalendarModule,
    InputMaskModule,
  ],
  templateUrl: './students-form.component.html',
  styleUrls: ['./students-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentsFormComponent implements OnInit, OnChanges {
  @Output() formSave = new EventEmitter<Student>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  highSchool: DropdownModel<number>[] = [];
  genders: DropdownModel<number>[] = [];
  studentClass = StudentClassModel.All;
  studentSection = StudentSectionModel.All;
  schoolProfile: DropdownModel<number>[] = [];
  academicYears: DropdownModel<number>[] = [];
  saving = false;
  @Input() set studentDetails(details: Student | null) {
    if (details) {
      this.student = Object.assign({}, details);
    }
  }

  showStudent = false;
  submitted = false;

  student: Student = {
    birthDate: new Date(),
    birthPlace: '',
    email: '',
    genderId: 0,
    idCard: '',
    isA2A3: true,
    isEAlbaniaApplication: true,
    isFall: false,
    lastName: '',
    genderName: '',
    highSchool: '',
    middleName: '',
    mobilePhone: '',
    oldID: '',
    schoolFinished: '',
    schoolProfile: '',
    highSchoolName: '',
    schoolName: '',
    highSchoolId: 0,
    session: '',
    studentId: '',
    studyClass: '',
    profileId: 0,
    profileName: '',
    firstName: '',
    schoolFinishedName: '',
    registrationYearId: undefined,

    isConfirmedBySupervisor: true,
    graduationYear: undefined,
  };

  finishedAtSameSchool = true;

  constructor(
    private cd: ChangeDetectorRef,
    private readonly academicYearService: AcademicYearApiService,
    private readonly studentService: StudentsApiService,
    private readonly highSchoolService: HighSchoolApiService,
    private readonly profileService: ProfileApiService,
    private readonly genderService: GendersApiService,
    private router: Router
  ) {}
  ngOnInit(): void {
    // todo ! maybe  switch to pipes
    this.highSchoolService.loadDropDownList().subscribe(response => {
      this.highSchool = response.data;
    });
    this.genderService.loadDropdownList().subscribe(response => {
      this.genders = response.data;
    });
    this.profileService.loadDropdownList().subscribe(response => {
      this.schoolProfile = response.data;
    });

    this.academicYearService.loadDropdownList().subscribe(response => {
      this.academicYears = response.data;
    });
  }

  ngOnChanges(): void {
    console.log();
    // eslint-disable-next-line max-len
    this.onStudentChange({ value: this.student.highSchoolId });
  }

  onStudentChange($event: any) {
    console.log($event);
    this.showStudent = $event.value;
  }

  onSubmit(): void {
    if (this.finishedAtSameSchool) {
      this.student.schoolFinished = '';
    }

    const data = { ...this.student };

    this.studentService.save(data).subscribe({
      next: value => {
        this.saving = false;

        this.router.navigate(['/configurations/students']).then();
      },
    });
  }
}
