/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FailingStudentApiService } from '@msh/applications/data-access-applications';
import { FailingStudent } from '@msh/applications/domain-application';
import { StudentsApiService } from '@msh/configurations/data-access-configurations';
import { Student } from '@msh/shared/domain-models';
import { GlobalToastService } from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';

@UntilDestroy()
@Component({
  selector: 'msh-manage-failing-students-form',
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
  ],
  templateUrl: './manage-failing-students-form.component.html',
  styleUrls: ['./manage-failing-students-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageFailingStudentsFormComponent {
  @Input() set failingStudentDetails(details: FailingStudent | null) {
    if (details) {
      this.failingStudent = Object.assign({}, details);
    }
  }

  @Output() formSave = new EventEmitter<FailingStudent>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  constructor(
    private cd: ChangeDetectorRef,
    private readonly failingStudentService: FailingStudentApiService,
    private readonly studentService: StudentsApiService,
    private readonly toastService: GlobalToastService
  ) {}

  ngOnInit(): void {
   this.getFailingStudentById(this.failingStudent.id!);
  }

  submitted = false;

  student: Student = {
    birthDate: new Date(),
    birthPlace: '',
    email: '',
    firstName: '',
    isA2A3: false,
    isEAlbaniaApplication: false,
    lastName: '',
    middleName: '',
    mobilePhone: '',
    highSchool: '',
    oldID: '',
    schoolName: '',
    genderName: '',
    schoolFinished: '',
    schoolProfile: '',
    profileName: '',
    studentId: '',
    highSchoolName: '',
    isFall: false,
    schoolFinishedName: '',
    createdOn: new Date(),
    createdName: '',
  };

  failingStudent: FailingStudent = {
    id: '',
    subject: undefined,
  };

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.failingStudent);
    }
  }

  getFailingStudentById(studentId: string) {
    this.failingStudentService
      .getOne(studentId)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.failingStudent = response.data;
          this.failingStudent.studentId = response.data.studentId;
          this.getStudentData(response.data.studentId);
          this.cd.detectChanges();
        }

        if (!response.isSuccessful) {
          this.toastService.showError(
            'Ndodhi nje problem gjatë kerkimit te studentit mbetes!'
          );
        }
      });
  }

  getStudentData(studentId: any) {
    this.studentService
      .getById(studentId)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.failingStudent = response.data;
          this.failingStudent.studentId = this.student.studentId
          this.cd.detectChanges();
        }
      });
  }
}
