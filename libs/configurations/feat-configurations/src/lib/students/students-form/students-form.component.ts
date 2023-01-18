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
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import {CalendarModule} from 'primeng/calendar';
import {InputMaskModule} from "primeng/inputmask";
import {
  AcademicYearApiService, GendersApiService,
  HighSchoolApiService, ProfileApiService,
  StudentsApiService
} from "@msh/configurations/data-access-configurations";
import {Student} from "../../../../../domain-configurations/src/students/students.model";

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
export class StudentsFormComponent implements OnChanges {

  @Output() formSave = new EventEmitter<Student>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  highSchool: DropdownModel<number>[] = [];
  genders: DropdownModel<number>[] = [];
  studyClass: DropdownModel<number>[] = [];
  session: DropdownModel<number>[] = [];
  schoolProfile: DropdownModel<number>[] = [];
  academicYears: DropdownModel<number>[] = [];
  @Input() set studentDetails(details: Student | null) {
    if (details) {
      this.student = Object.assign({}, details);
    }
  }




  showStudent = false;
  submitted = false;



  student: Student = {
    birthDate: 0,
    birthPlace: "",
    email: "",
    gender: "",
    idCard: "",
    isA2A3: true,
    isEAlbaniaApplication: true,
    isFall: false,
    lastName: "",
    middleName: "",
    mobilePhone: "",
    oldId: "",
    schoolFinished: "",
    schoolName: "",
    highSchool: "",
    schoolProfile: "",
    session: "",
    studentId: "",
    studyClass: "",
    firstName: '',
    isConfirmedBySupervisor: true
  };

  studentNotImplementedProps = {
    birthDate: 0,
    birthPlace: "",
    email: "",
    gender: "",
    idCard: "",
    isA2A3: true,
    isEAlbaniaApplication: true,
    isFall: false,
    lastName: "",
    middleName: "",
    mobilePhone: "",
    oldId: "",
    schoolFinished: "",
    schoolName: "",
    highSchool: "",
    schoolProfile: "",
    session: "",
    studentId: "",
    studyClass: "",
    firstName: '',
    isConfirmedBySupervisor: true,
    graduationYear: false
  };
  // eslint-disable-next-line @typescript-eslint/no-empty-function


  onSubmit() : void{
    this.submitted = true;
    if (this.form.valid) {
      console.log(this.student, this.studentNotImplementedProps);
    }
    console.log(this.student, this.studentNotImplementedProps);
  }
  constructor(
    private cd: ChangeDetectorRef,
    private readonly academicYearService: AcademicYearApiService,
    private readonly studentService: StudentsApiService,
    private readonly highSchoolService: HighSchoolApiService,
    private readonly profileService: ProfileApiService,
    private readonly genderService: GendersApiService,

  ) {}
  ngOnInit(): void {
    this.highSchoolService.loadDropDownList().subscribe(response => {
      this.highSchool = response.data;
    });
    this.genderService.loadDropdownList().subscribe(response => {
      this.genders = response.data;
    });
    this.profileService.loadDropdownList().subscribe(response => {
      this.schoolProfile = response.data;
    });
    console.log('init');
  }

  ngOnChanges(): void {
    console.log(this.studentNotImplementedProps.highSchool);
    // eslint-disable-next-line max-len
    this.onStudentChange({ value: this.studentNotImplementedProps.highSchool });
  }

  onStudentChange($event: any) {
    console.log($event);
    this.showStudent = $event.value;
  }
}


