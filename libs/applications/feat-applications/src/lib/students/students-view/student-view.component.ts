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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { A1ZTableRecord } from '@msh/applications/domain-application';
import { StudentsApiService } from '@msh/configurations/data-access-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { Student } from '@msh/shared/domain-models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import {
  PermissionCheckService,
  PermissionEnum,
} from '@msh/auth/data-access-auth';

@UntilDestroy()
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
    RouterLink,
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
    countryId: 0,
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
  forms: A1ZTableRecord[] = [];
  finishedAtSameSchool = true;
  showEditButton = false;
  id: string | null;

  constructor(
    private cd: ChangeDetectorRef,
    private readonly studentService: StudentsApiService,
    private router: Router,
    private route: ActivatedRoute,
    private readonly permissionCheckService: PermissionCheckService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.studentService
      .getById(this.id)
      .pipe(untilDestroyed(this))
      .subscribe(result => {
        this.student = { ...result.data };
        this.finishedAtSameSchool =
          this.student?.schoolFinished == '' ||
          this.student?.schoolFinished == null;
        this.cd.detectChanges();
      });

    this.studentService
      .getA1A1ZByStudentId(this.id as string)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        this.forms = response.data ?? [];
        this.cd.detectChanges();
      });

    this.showEditButton = this.permissionCheckService.hasPermission(
      PermissionEnum.EditApplications as any
    );
  }

  ngOnChanges(): void {
    this.showStudent = this.student.highSchoolId != null;
  }

  navigateToForm(a1: A1ZTableRecord) {
    let routePath: string;

    if (this.showEditButton) {
      if (a1.isA1) {
        routePath = `/applications/a1/for-student/${this.student?.id}/edit/${a1.id}`;
      } else {
        routePath = `/applications/a1z/for-student/${this.student?.id}/edit/${a1.id}`;
      }
    } else {
      if (a1.isA1) {
        routePath = `/applications/a1/view/${a1.id}`;
      } else {
        routePath = `/applications/a1z/view/${a1.id}`;
      }
    }

    this.router.navigate([routePath]);
  }
}
