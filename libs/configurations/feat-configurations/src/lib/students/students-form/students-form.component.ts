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
import { Router, RouterModule } from '@angular/router';
import { FormType } from '@msh/applications/domain-application';
import { AuthFacade } from '@msh/auth/data-access-auth';
import {
  AcademicYearApiService,
  GendersApiService,
  HighSchoolApiService,
  ProfileApiService,
  StudentsApiService,
} from '@msh/configurations/data-access-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import {
  Student,
  StudentClassModel,
  StudentSectionModel,
} from '@msh/shared/domain-models';
import {
  AlbanianNidValidatorDirective,
  GlobalToastService,
} from '@msh/shared/util-shared';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { A1a1zConfirmationDialogComponent } from '../manage-students/a1a1z-confirmation-dialog/a1a1z-confirmation-dialog.component';

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
    AlbanianNidValidatorDirective,
    RouterModule,
    A1a1zConfirmationDialogComponent,
    DialogModule,
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
  saving = false;
  academicYears: DropdownModel<number>[] = [];
  displayModal = false;
  studentId: any;
  @Input() set studentDetails(details: Student | null) {
    if (details) {
      this.student = Object.assign({}, details);
    }
  }
  showStudent = false;
  submitted = false;
  maxDate = new Date();
  student: Student = {
    createdName: '',
    createdOn: new Date(),
    modifiedByName: '',
    modifiedOn: new Date(),
    birthDate: this.maxDate,
    birthPlace: '',
    email: '',
    genderId: 0,
    idCard: '',
    isA2A3: true,
    isEAlbaniaApplication: true,
    isFall: false,
    isAN: false,
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
    registrationYearId: 0,
    graduationYear: undefined,
    isConfirmedBySupervisor: false,
  };
  finishedAtSameSchool = true;

  constructor(
    private cd: ChangeDetectorRef,
    private readonly studentService: StudentsApiService,
    private readonly highSchoolService: HighSchoolApiService,
    private readonly profileService: ProfileApiService,
    private readonly genderService: GendersApiService,
    private academicYearService: AcademicYearApiService,
    private router: Router,
    private authFacade: AuthFacade,
    private readonly toastService: GlobalToastService
  ) {
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 10);
  }
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
      const activeYear: any = response.data.find(
        (data: any) => data.value === new Date().getFullYear().toString()
      );
      if (activeYear) {
        this.student.registrationYearId = activeYear.key;
      }
    });
  }

  ngOnChanges(): void {
    this.showStudent = this.student.highSchoolId != null;
  }

  onSubmit(): void {
    if (this.finishedAtSameSchool) {
      this.student.schoolFinished = '';
    }
    const data = { ...this.student };

    this.studentService.save(data).subscribe({
      next: response => {
        if (response.isSuccessful) {
          this.displayModal = true;
          this.studentId = response.data.id;
          this.cd.detectChanges();
        } else this.toastService.showError(response.errorMessage);
        if (response.isBadRequest) {
          this.toastService.showError(
            'Ndodhi një problem gjatë krijimit të studentit'
          );
        }
        this.saving = false;
      },
    });
  }
  navigateToGrid() {
    this.router.navigate(['/configurations/students']);
  }
  onModalClose() {
    this.displayModal = false;
    if (this.studentId) {
      this.router.navigate([`/configurations/student-edit/${this.studentId}`]);
    }
  }
  onFormSave(formType: FormType) {
    switch (formType) {
      case FormType.A1:
        this.router.navigate(['/applications/save-a1-student', this.studentId]);
        break;
      case FormType.A1Z:
        this.router.navigate([
          '/applications/save-a1z-student',
          this.studentId,
        ]);
        break;
    }
  }
}
