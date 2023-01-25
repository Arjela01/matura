import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnChanges,
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
import { Student } from '@msh/configurations/domain-configurations';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { StudentClassModel } from '../../../../../domain-configurations/src/students/student-class.model';
import { StudentSectionModel } from '../../../../../domain-configurations/src/students/student-section.model';

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
})
export class StudentsEditComponent {
  @ViewChild('form', { static: true }) form!: NgForm;

  highSchool: DropdownModel<number>[] = [];
  genders: DropdownModel<number>[] = [];
  studentClass = StudentClassModel.All;
  studentSection = StudentSectionModel.All;
  schoolProfile: DropdownModel<number>[] = [];
  academicYears: DropdownModel<number>[] = [];
  saving = false;
  id: any;

  showStudent = false;
  submitted = false;

  current = null;
  loading = false;
  student: Student = {
    birthDate: new Date(),
    birthPlace: '',
    email: '',
    genderId: 0,
    genderName: '',
    idCard: '',
    isA2A3: true,
    isEAlbaniaApplication: true,
    isFall: false,
    lastName: '',
    highSchool: '',
    middleName: '',
    mobilePhone: '',
    oldID: '',
    schoolFinished: '',
    schoolProfile: '',
    highSchoolName: '',
    schoolName: '',
    schoolFinishedName: '',
    highSchoolId: 0,
    session: '',
    studentId: '',
    studyClass: '',
    profileId: 0,
    profileName: '',
    firstName: '',
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
    private router: Router,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }
  ngOnInit(): void {
    this.highSchoolService.loadDropDownList().subscribe(response => {
      this.highSchool = response.data;
      this.cd.detectChanges();
    });

    this.genderService.loadDropdownList().subscribe(response => {
      this.genders = response.data;
      this.cd.detectChanges();
    });

    this.profileService.loadDropdownList().subscribe(response => {
      this.schoolProfile = response.data;
      this.cd.detectChanges();
    });

    this.studentService.getById(this.id).subscribe(result => {
      this.student = {
        ...result.data,
        birthDate: new Date(result.data.birthDate),
      };
      this.cd.detectChanges();
    });
  }

  update(): void {
    this.saving = true;
    this.studentService.update({ id: this.id, ...this.student }).subscribe({
      next: value => {
        this.saving = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Studenti u ruajt me sukses.',
        });
        console.log(value);

        this.router.navigate(['/configurations/students']).then();
      },
      error: error => {
        this.saving = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Studenti nuk mund te ruhet: ${error}`,
        });
      },
    });
  }
}
