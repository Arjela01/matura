import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AcademicYearApiService,
  GendersApiService,
  HighSchoolApiService,
  ProfileApiService,
  StudentsApiService,
} from '@msh/configurations/data-access-configurations';
import { Student } from '@msh/shared/domain-models';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';

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
export class StudentViewComponent implements OnChanges, OnInit {
  @Output() formSave = new EventEmitter<Student>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  genders: DropdownModel<number>[] = [];
  academicYears: DropdownModel<number>[] = [];
  @Input() set studentDetails(details: Student | null) {
    if (details) {
      this.student = Object.assign({}, details);
    }
  }

  showStudent = false;
  submitted = false;

  student: Student = {
    createdName: '',
    createdOn: new Date(),
    modifiedByName: '',
    modifiedOn: new Date(),
    birthDate: new Date(),
    birthPlace: '',
    email: '',
    genderId: 1,
    idCard: '',
    isA2A3: true,
    isEAlbaniaApplication: true,
    isFall: false,
    lastName: '',
    highSchool: '',
    middleName: '',
    mobilePhone: '',
    profileName: '',
    genderName: '',
    oldID: '',
    profileId: 0,
    schoolFinished: '',
    schoolProfile: '',
    highSchoolName: '',
    schoolName: '',
    highSchoolId: 0,
    session: '',
    studentId: '',
    studyClass: '',
    schoolFinishedName: '',
    firstName: '',
    graduationYear: undefined,
  };

  finishedAtSameSchool = true;

  id: string | null;

  constructor(
    private cd: ChangeDetectorRef,
    private readonly academicYearService: AcademicYearApiService,
    private readonly studentService: StudentsApiService,
    private readonly highSchoolService: HighSchoolApiService,
    private readonly profileService: ProfileApiService,
    private readonly genderService: GendersApiService,
    private router: Router,
    private messageService: MessageService,

    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.studentService.getById(this.id).subscribe(result => {
      this.student = { ...result.data };
      this.finishedAtSameSchool =
        this.student?.schoolFinished == '' ||
        this.student?.schoolFinished == null;
      this.cd.detectChanges();
    });
  }

  ngOnChanges(): void {
    this.showStudent = this.student.highSchoolId != null;
  }
}
