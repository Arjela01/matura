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
  @Input() highSchool: DropdownModel<number>[] = [];
  @Input() genders: DropdownModel<number>[] = [];
  @Input() studyClass: DropdownModel<number>[] = [];
  @Input() session: DropdownModel<number>[] = [];
  @Input() schoolProfile: DropdownModel<number>[] = [];

  @Input() set studentDetails(details: Student | null) {
    if (details) {
      this.student = Object.assign({}, details);
    }
  }
  @Output() formSave = new EventEmitter<Student>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  highSchoolFiltered: DropdownModel<number>[] = [];
  gendersFiltered: DropdownModel<number>[] = [];
  profileGroupFiltered: DropdownModel<number>[] = [];
  studyClassFiltered: DropdownModel<number>[] = [];
  sessionFiltered: DropdownModel<number>[] = [];
  schoolProfileFiltered: DropdownModel<number>[] = [];

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

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private cd: ChangeDetectorRef) {
    // this.shkolla = [
    //   {name: 'New York', code: 'NY', },
    //   {name: 'Rome', code: 'RM'},
    // ];
    // this.gjinia = [
    //   {name: 'mashkull', code: 'NY', },
    //   {name: 'femer', code: 'RM'},
    // ];
    // this.klasa = [
    //   {name: 'pare', code: 'NY', },
    //   {name: 'dyte', code: 'RM'},
    //   {name: 'trete', code: 'RM'},
    // ];
    // this.seksioni = [
    //   {name: 'pare', code: 'NY', },
    //   {name: 'dyte', code: 'RM'},
    //   {name: 'trete', code: 'RM'},
    // ];

  }
  ngOnChanges(): void {
    if (this.genders && this.student.gender) {
      this.onGenderChange({ value: this.student.gender });
    }
    if (this.studyClass && this.student.studyClass) {
      this.onStudyClassChange({ value: this.student.studyClass });
    }
    if (this.session && this.student.session) {
      this.onSessionChange({ value: this.student.session });
    }
    if (this.schoolProfile && this.student.schoolProfile) {
      this.onProfileSchoolChange({ value: this.student.schoolProfile });
    }
    if (this.highSchool && this.student.highSchool) {
      this.onProfileSchoolChange({ value: this.student.highSchool });
    }
  }

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.student);
    }
  }


  onGenderChange($event: any) {
    this.gendersFiltered = this.genders.filter(
      p => p.parentKey == $event.value
    );
  }


  onStudyClassChange($event: any) {
    this.studyClassFiltered = this.studyClass.filter(
      p => p.parentKey == $event.value
    );
  }

  onProfileSchoolChange($event: any) {
    this.schoolProfileFiltered = this.schoolProfile.filter(
      p => p.parentKey == $event.value
    );
  }
  onHighSchoolChange($event: any) {
    this.highSchoolFiltered = this.highSchool.filter(
      p => p.parentKey == $event.value
    );
  }

  onSessionChange($event: any) {
    this.sessionFiltered = this.session.filter(
      p => p.parentKey == $event.value
    );
  }

}
