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

@Component({
  selector: 'msh-students-edit',
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
  templateUrl: './students-edit.component.html',
  styleUrls: ['./students-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentsEditComponent implements OnChanges {

  @Output() formSave = new EventEmitter<Student>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  highSchool: DropdownModel<number>[] = [];
  genders: DropdownModel<number>[] = [];
  studyClass: DropdownModel<number>[] = [];
  session: DropdownModel<number>[] = [];
  schoolProfile: DropdownModel<number>[] = [];
  academicYears: DropdownModel<number>[] = [];
  saving= false;
  id : any;
  @Input() set studentDetails(details: Student | null) {
    if (details) {
      this.student = Object.assign({}, details);
    }
  }




  showStudent = false;
  submitted = false;

current = null;
loading = false;
  student: Student = {
    birthDate: new Date(),
    birthPlace: "",
    email: "",
    genderId: 0,
    genderName: "",
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
    schoolFinishedName: "",
    highSchoolId: 0,
    session: "",
    studentId: "",
    studyClass: "",
    profileId: 0,
    profileName: "",
    firstName: '',
    isConfirmedBySupervisor: true,
    graduationYear: "",
  };
  // eslint-disable-next-line @typescript-eslint/no-empty-function


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

      this.highSchoolService.loadDropDownList().subscribe(response => {
      this.highSchool = response.data;
    });
    this.genderService.loadDropdownList().subscribe(response => {
      this.genders = response.data;
    });
    this.profileService.loadDropdownList().subscribe(response => {
      this.schoolProfile = response.data;
    });

      this.student = {...result.data};
      this.cd.detectChanges();
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

  update(): void {
    this.saving = true;
    this.studentService.update({id: this.id,...this.student})
      .subscribe(
        {
          next: value => {
            this.saving = false;
            this.messageService.add({severity: 'success', summary: 'Success', detail: 'Studenti u ruajt me sukses.'});
            console.log(value);

            this.router.navigate(['/configurations/students']).then();
          },
          error: error => {
            this.saving = false;
            this.messageService.add({severity: 'error', summary: 'Error', detail: `Studenti nuk mund te ruhet: ${error}`});
          }
        }
      );
  }
}

