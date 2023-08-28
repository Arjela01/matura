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
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FormType } from '@msh/applications/domain-application';
import { AuthFacade } from '@msh/auth/data-access-auth';
import {
  AcademicYearApiService,
  CountriesApiService,
  GendersApiService,
  HighSchoolApiService,
  ProfileApiService,
  StudentsApiService,
} from '@msh/configurations/data-access-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import {
  AcademicYear,
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
  countriesList: DropdownModel<number>[] = [];
  saving = false;
  academicYears: DropdownModel<number>[] = [];
  displayModal = false;
  studentId: any;
  disabled = false;
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
    highSchoolName: '',
    schoolName: '',
    studentId: '',
    profileName: '',
    firstName: '',
    schoolFinishedName: '',
    registrationYearId: 0,
    countryId: 0,
    graduationYear: undefined,
    isConfirmedBySupervisor: false,
    schoolProfile: '',
  };
  finishedAtSameSchool = true;
  currentAcademicYear?: Partial<AcademicYear>;
  selectedCountry: any | null = null;
  constructor(
    private cd: ChangeDetectorRef,
    private readonly studentService: StudentsApiService,
    private readonly highSchoolService: HighSchoolApiService,
    private readonly profileService: ProfileApiService,
    private readonly genderService: GendersApiService,
    private academicYearService: AcademicYearApiService,
    private router: Router,
    private authFacade: AuthFacade,
    private readonly toastService: GlobalToastService,
    private countriesService: CountriesApiService
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
    this.countriesService.loadDropdownList().subscribe(response => {
      this.countriesList = response.data;
      this.student.countryId = this.countriesList.find(
        data => data.additionalValue === 'AL'
      )?.key as number;
      this.cd.detectChanges();
    });
    this.authFacade.academicYear$.subscribe(data => {
      this.currentAcademicYear = data;
      if (!this.student.id) {
        this.student.isFall = this.currentAcademicYear?.isFall ?? false;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.showStudent = this.student.highSchoolId != null;
  }

  onSubmit(): void {
    if (this.finishedAtSameSchool) {
      this.student.schoolFinished = '';
    }
    const data = { ...this.student };
    this.disabled = true;
    this.studentService.save(data).subscribe({
      next: response => {
        if (response.isSuccessful) {
          this.displayModal = true;
          this.studentId = response.data.id;
          this.cd.detectChanges();
        } else {
          this.enableSaveButton();
          this.toastService.showError(response.errorMessage);
        }
        if (response.isBadRequest) {
          this.enableSaveButton();
          this.toastService.showError(
            'Ndodhi një problem gjatë krijimit të studentit'
          );
        }
        this.saving = false;
      },
    });
  }

  navigateToGrid() {
    this.router.navigate(['/applications/students']);
  }

  onModalClose() {
    this.displayModal = false;
    if (this.studentId) {
      this.toastService.showSuccess('Maturanti u shtua me sukses');
      this.navigateToGrid();
    }
  }

  onFormSave(formType: FormType) {
    switch (formType) {
      case FormType.A1:
        this.router.navigate([
          '/applications/a1/for-student',
          this.studentId,
          'add',
        ]);
        break;
      case FormType.A1Z:
        this.router.navigate([
          '/applications/a1z/for-student',
          this.studentId,
          'add',
        ]);
        break;
      default:
        this.displayModal = false;
        break;
    }
  }
  private enableSaveButton() {
    this.disabled = false;
    this.cd.detectChanges();
  }
}
