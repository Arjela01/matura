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
import {FormsModule, NgForm} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {InputNumberModule} from "primeng/inputnumber";
import {RadioButtonModule} from "primeng/radiobutton";
import {InputTextareaModule} from "primeng/inputtextarea";
import {ButtonModule} from "primeng/button";
import {CheckboxModule} from "primeng/checkbox";
import {DropdownModule} from "primeng/dropdown";
import {CalendarModule} from "primeng/calendar";
import {InputMaskModule} from "primeng/inputmask";
import {Student} from "@msh/shared/domain-models";
import {DropdownModel} from "@msh/shared/data-access-shared";
import {
  AcademicYearApiService, GendersApiService,
  HighSchoolApiService, ProfileApiService,
  StudentsApiService
} from "@msh/configurations/data-access-configurations";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {LazyLoadEvent, MessageService} from "primeng/api";
import {ArchiveExam, ArchiveFolder, ExamGrade} from "@msh/evaluations/domain-evaluations";
import {ExamGradeApiService} from "@msh/evaluations/data-access-evaluations";
import {BehaviorSubject} from "rxjs";
import {GridEvent} from "@msh/shared/util-shared";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
@UntilDestroy()

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
  ],
  templateUrl: './a2-form-annual-grades-view.component.html',
  styleUrls: ['./a2-form-annual-grades-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class A2FormAnnualGradesViewComponent implements OnChanges, OnInit {

  @Output() formSave = new EventEmitter<Student[] | ExamGrade[]>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  genders: DropdownModel<number>[] = [];
  academicYears: DropdownModel<number>[] = [];
  @Input() set studentDetails(details: Student | null) {
    if (details) {
      this.student = Object.assign({}, details);
    }
  }
  private annualExamGrade$$ = new BehaviorSubject<ExamGrade[]>([]);
  @Input() examGrades: ExamGrade[] = [];

  @Output() gridEvent = new EventEmitter<
    GridEvent<ExamGrade[] | Student[]>
  >();
  @Output() lazyLoadData = new EventEmitter<LazyLoadEvent>();
  totalRecords = 0;
  filters: LazyLoadEvent | null = null;


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

  examGrade: ExamGrade = {} as ExamGrade;

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
    private route: ActivatedRoute,
    private readonly examGradeApiService: ExamGradeApiService,
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
      this.examGradeApiService
        .getById(this.id)
        .subscribe(result => (this.examGrade = { ...result.data }));
    this.cd.detectChanges();

  }



  ngOnChanges(): void {
    this.showStudent = this.student.highSchoolId != null;
  }
}
