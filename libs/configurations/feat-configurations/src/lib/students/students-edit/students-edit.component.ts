import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormType } from '@msh/applications/domain-application';
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
import { A1a1zConfirmationDialogComponent } from '../manage-students/a1a1z-confirmation-dialog/a1a1z-confirmation-dialog.component';

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
    DialogModule,
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
    highSchoolId: 0,
    session: '',
    studentId: '',
    studyClass: '',
    profileId: 0,
    profileName: '',
    firstName: '',
    registrationYearId: undefined,
    graduationYear: new Date().getFullYear(),
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
    private route: ActivatedRoute,
    private readonly confirmationService: ConfirmationService
  ) {
    this.id = this.route.snapshot.paramMap.get('id') as string;
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 10);
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
      if (!result.data.registrationYearId) {
        this.academicYearService.loadDropdownList().subscribe(response => {
          const activeYear: any = response.data.find(
            (data: any) => data.value === new Date().getFullYear().toString()
          );
          if (activeYear) {
            this.student.registrationYearId = activeYear.key;
          }
        });
      }
      this.finishedAtSameSchool =
        this.student?.schoolFinished == '' ||
        this.student?.schoolFinished == null;
      this.cd.detectChanges();
    });
  }

  onModalClose() {
    this.displayModal = false;
  }

  update(): void {
    if (this.finishedAtSameSchool) {
      this.student.schoolFinished = '';
    }
    this.saving = true;
    this.studentService.update({ id: this.id, ...this.student }).subscribe({
      next: value => {
        this.saving = false;
        if (value.isSuccessful) {
          this.displayModal = true;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: value.errorMessage,
          });
        }
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
    this.cd.markForCheck();
  }
  onFormSave(formType: FormType) {
    switch (formType) {
      case FormType.A1:
        // TODO : If student already have an A1 get with this endpoint by id student :

        // this.studentService
        //   .getA1A1ZByStudentId(this.id as string)
        //   .subscribe(data => {
        //     console.log(data);
        //   });
        this.router.navigate([
          '/applications/save-a1-student',
          this.student.id,
        ]);
        break;
      case FormType.A1Z:
        // TODO : If student already have an A1Z get with this endpoint by id student :

        // this.studentService
        //   .getA1A1ZByStudentId(this.id as string)
        //   .subscribe(data => {
        //     console.log(data);
        //   });
        this.router.navigate([
          '/applications/save-a1z-student',
          this.student.id,
        ]);
        break;
    }
  }
}
