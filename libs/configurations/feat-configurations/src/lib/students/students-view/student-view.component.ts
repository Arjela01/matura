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
import { FormsModule, NgForm} from '@angular/forms';
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
import { Student } from '@msh/configurations/domain-configurations';
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {untilDestroyed} from "@ngneat/until-destroy";

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
  templateUrl: './student-view.component.html',
  styleUrls: ['./student-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentViewComponent implements OnChanges {

  @Output() formSave = new EventEmitter<Student>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  highSchools: DropdownModel<number>[] = [];
  genders: DropdownModel<number>[] = [];
  studyClass: DropdownModel<number>[] = [];
  session: DropdownModel<number>[] = [];
  schoolProfiles: DropdownModel<number>[] = [];
  academicYears: DropdownModel<number>[] = [];
  saving= false;
  @Input() set studentDetails(details: Student | null) {
    if (details) {
      this.student = Object.assign({}, details);
    }
  }




  showStudent = false;
  submitted = false;



  student: Student = {
    birthDate: new Date(),
    birthPlace: "",
    email: "",
    genderId: 1,
    idCard: "",
    isA2A3: true,
    isEAlbaniaApplication: true,
    isFall: false,
    lastName: "",
    highSchool: "",
    middleName: "",
    mobilePhone: "",
    oldId: "",
    schoolFinished: "",
    schoolProfile: "",
    highSchoolName: "",
    schoolName: "",
    highSchoolId: 0,
    session: "",
    studentId: "",
    studyClass: "",
    firstName: '',
    isConfirmedBySupervisor: true,
    graduationYear: ""
  };
  // eslint-disable-next-line @typescript-eslint/no-empty-function

  id : any;
  genderId:any;

  constructor(
    private cd: ChangeDetectorRef,
    private readonly academicYearService: AcademicYearApiService,
    private readonly studentService: StudentsApiService,
    private readonly highSchoolService: HighSchoolApiService,
    private readonly profileService: ProfileApiService,
    private readonly genderService: GendersApiService, private router: Router,
    private messageService: MessageService,

    private route: ActivatedRoute

  ) {
    this.id = this.route.snapshot.paramMap.get('id')
  }

  ngOnInit(): void {
    this.studentService.getById(this.id).subscribe(result => {
      this.student = result.data;
    })

    this.getHighSchools();
    this.getGenders();
    this.getProfiles();
  }

  getHighSchools() {
    this.highSchoolService
      .loadDropDownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.highSchools = response.data;
      });
  }

  getGenders() {
    this.genderService
      .loadGenders(this.genderId)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.genderId = response.data;
      });
  }

  getProfiles() {
    this.profileService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.schoolProfiles = response.data;
      });
  }


  ngOnChanges(): void {
    console.log(this.student.highSchoolId);
    // eslint-disable-next-line max-len
    this.onStudentChange({ value: this.student.highSchoolId });
  }

  onStudentChange($event: any) {
    console.log($event);
    this.showStudent = $event.value;
  }

}
