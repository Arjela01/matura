import { CommonModule, formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { A1ZTableRecord, FormType } from '@msh/applications/domain-application';
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
  CountryName,
  Student,
  StudentClassModel,
  StudentSectionModel,
} from '@msh/shared/domain-models';
import {
  AlbanianNidValidatorDirective,
  GlobalToastService,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { A1a1zConfirmationDialogComponent } from '../manage-students/a1a1z-confirmation-dialog/a1a1z-confirmation-dialog.component';

@UntilDestroy()
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
    ConfirmDialogModule,
    CheckboxModule,
    DropdownModule,
    CalendarModule,
    InputMaskModule,
    A1a1zConfirmationDialogComponent,
    AlbanianNidValidatorDirective,
    DialogModule,
    RippleModule,
    RouterLink,
  ],
  templateUrl: './students-edit.component.html',
  styleUrls: ['./students-edit.component.scss'],
  providers: [ConfirmationService],
})
export class StudentsEditComponent implements OnInit {
  @ViewChild('form', { static: true }) form!: NgForm;

  highSchool: DropdownModel<number>[] = [];
  genders: DropdownModel<number>[] = [];
  studentClass = StudentClassModel.All;
  studentSection = StudentSectionModel.All;
  schoolProfile: DropdownModel<number>[] = [];
  academicYears: DropdownModel<number>[] = [];
  saving = false;
  id?: string;
  maxDate = new Date();
  submitted = true;
  displayModal = false;
  current = null;
  loading = false;
  student: Student = {
    createdName: '',
    createdOn: new Date(),
    birthDate: this.maxDate,
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
    session: '',
    studentId: '',
    studyClass: '',
    profileName: '',
    firstName: '',
    countryId: CountryName.Albania,
    registrationYearId: undefined,
    graduationYear: new Date().getFullYear(),
  };
  forms: A1ZTableRecord[] = [];
  finishedAtSameSchool = true;
  disabled = false;
  countriesList: DropdownModel<number>[] = [];
  isAlbanian = true;
  constructor(
    private cd: ChangeDetectorRef,
    private readonly academicYearService: AcademicYearApiService,
    private readonly studentService: StudentsApiService,
    private readonly highSchoolService: HighSchoolApiService,
    private readonly profileService: ProfileApiService,
    private readonly genderService: GendersApiService,
    private router: Router,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private readonly confirmationService: ConfirmationService,
    private toasterService: GlobalToastService,
    private countriesService: CountriesApiService
  ) {
    this.id = this.route.snapshot.paramMap.get('id') as string;
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 10);
  }

  ngOnInit(): void {
    this.highSchoolService
      .loadDropDownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.highSchool = response.data;
        this.cd.detectChanges();
      });

    this.genderService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.genders = response.data;
        this.cd.detectChanges();
      });

    this.profileService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.schoolProfile = response.data;
        this.cd.detectChanges();
      });

    this.studentService
      .getById(this.id)
      .pipe(untilDestroyed(this))
      .subscribe(result => {
        this.student = {
          ...result.data,
          birthDate: new Date(result.data.birthDate),
        };
        this.isAlbanian = this.student.countryId === CountryName.Albania;
        if (!result.data.registrationYearId) {
          this.academicYearService
            .loadDropdownList()
            .pipe(untilDestroyed(this))
            .subscribe(response => {
              const activeYear: any = response.data.find(
                (data: any) =>
                  data.value === new Date().getFullYear().toString()
              );
              if (activeYear) {
                this.student.registrationYearId = activeYear.key;
              }
            });
        }
        this.finishedAtSameSchool =
          this.student?.schoolFinished == '' ||
          this.student?.schoolFinished == null;
      });

    this.countriesService.loadDropdownList().subscribe(response => {
      this.countriesList = response.data;
      // this.student.stateId = this.countriesList.find(
      //   data => data.additionalValue === 'AL'
      // )?.key as number;
      this.cd.detectChanges();
    });

    this.studentService
      .getA1A1ZByStudentId(this.id as string)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        this.forms = response.data ?? [];
      });
  }

  changeCountry(country: CountryName) {
    this.isAlbanian = country === CountryName.Albania;
    const id = this.student.idCard;
    this.student.idCard = '';
    this.cd.detectChanges();
    this.student.idCard = id;
  }
  navigateToGrid() {
    this.router.navigate(['/applications/students']);
  }

  onModalClose() {
    this.displayModal = false;
    this.toasterService.showSuccess('Maturanti u modifikua me sukses');
    this.navigateToGrid();
  }

  update(): void {
    if (this.finishedAtSameSchool) {
      this.student.schoolFinished = '';
    }
    if (this.student.birthDate) {
      const formattedDate = formatDate(
        this.student.birthDate,
        'yyyy-MM-dd',
        'en-US'
      );
      this.student.birthDate = formattedDate as any;
    }
    this.disabled = true;
    this.saving = true;
    this.studentService
      .update({ id: this.id, ...this.student })
      .pipe(untilDestroyed(this))
      .subscribe({
        next: value => {
          this.saving = false;
          if (value.isSuccessful) {
            const a1 = this.forms.find(exam => exam.isA1);
            const a1Z = this.forms.find(exam => !exam.isA1);
            if (a1) {
              this.router.navigate([`/applications/a1/edit/${a1.id}`]);
            } else if (a1Z) {
              this.router.navigate([`/applications/a1z/edit/${a1Z.id}`]);
            } else {
              this.displayModal = true;
            }
          } else {
            this.enableSaveButton();
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: value.errorMessage,
            });
          }
        },
        error: error => {
          this.enableSaveButton();
          this.saving = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Studenti nuk mund te ruhet: ${error}`,
          });
        },
      });
    this.cd.markForCheck();
  }

  onFormSave(formType: FormType) {
    switch (formType) {
      case FormType.A1:
        this.router.navigate([
          '/applications/a1/for-student',
          this.student.id,
          'add',
        ]);
        break;
      case FormType.A1Z:
        this.router.navigate([
          '/applications/a1z/for-student',
          this.student.id,
          'add',
        ]);
        break;
    }
  }

  navigateToForm(a1: A1ZTableRecord) {
    if (a1.isA1) {
      this.router.navigate([
        `/applications/a1/for-student/${this.student.id}/edit/${a1.id}`,
      ]);
    } else {
      this.router.navigate([
        `/applications/a1z/for-student/${this.student.id}/edit/${a1.id}`,
      ]);
    }
  }

  private enableSaveButton() {
    this.disabled = false;
    this.cd.detectChanges();
  }
}
