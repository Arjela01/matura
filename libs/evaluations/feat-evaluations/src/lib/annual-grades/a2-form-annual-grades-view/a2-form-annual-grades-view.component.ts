import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputMaskModule } from 'primeng/inputmask';
import { IalModel, Student } from '@msh/shared/domain-models';
import {
  AcademicYearApiService,
  StudentsApiService,
} from '@msh/configurations/data-access-configurations';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import {
  AnnualGradesApiService,
  ExamGradeApiService,
} from '@msh/evaluations/data-access-evaluations';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { GlobalToastService } from '@msh/shared/util-shared';
import { AppDatePipe } from '@msh/shared/ui-shared';

@Component({
  selector: 'msh-a2-form-annual-grades-view',
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
    TableModule,
    DatePipe,
    AppDatePipe,
  ],
  templateUrl: './a2-form-annual-grades-view.component.html',
  styleUrls: ['./a2-form-annual-grades-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class A2FormAnnualGradesViewComponent implements OnInit {
  totalRecords = 0;
  filters: TableLazyLoadEvent | null = null;
  submitted = false;
  id: any;
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

  ialModel: any | IalModel = {
    averageGrade: 0,
    id: '',
    name: '',
  };

  examGrade: any[] = [];

  constructor(
    private cd: ChangeDetectorRef,
    private readonly academicYearService: AcademicYearApiService,
    private readonly studentService: StudentsApiService,
    private readonly examGradeApiService: ExamGradeApiService,
    private router: Router,
    private messageService: MessageService,
    private readonly annualGradeService: AnnualGradesApiService,
    private route: ActivatedRoute,
    private toastService: GlobalToastService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    // this.examGrades = {};
  }

  ngOnInit(): void {
    this.studentService.getById(this.id).subscribe(result => {
      this.student = { ...result.data };
      this.cd.detectChanges();
    });
    this.examGradeApiService.getById(this.id).subscribe(result => {
      this.examGrade = [...result.data];
      this.cd.detectChanges();
    });
    this.getAvgGrade();
  }

  getAvgGrade() {
    this.annualGradeService.getAverageGrade(this.id).subscribe(result => {
      this.ialModel = {
        ...this.ialModel,
        averageGrade: result.data?.averageGrade,
      };
      if (result.errorMessage) {
        this.toastService.showWarning(result.errorMessage);
      }
      this.cd.detectChanges();
    });
  }
}
