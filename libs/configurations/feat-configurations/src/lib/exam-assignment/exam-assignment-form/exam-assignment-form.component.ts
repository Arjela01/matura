import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {
  ExamAssignment,
  ExamDate,
  ExamSubjectProfile,
  Student,
} from '@msh/configurations/domain-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import {
  GlobalToastService,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import {
  ExamAssignmentApiService,
  ExamDateApiService,
  ExamSiteApiService,
} from '@msh/configurations/data-access-configurations';
import { StudentsApiService } from '@msh/configurations/data-access-configurations';
import { ActivatedRoute } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LazyLoadEvent } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { SharedStudentLookupComponent } from '../../../../../../shared/student-lookup/src/lib/components/shared-student-lookup.component';
import { A1zStudentSearchComponent } from '../../../../../../applications/feat-applications/src/lib/a1z/a1z-student-search/a1z-student-search.component';

@UntilDestroy()
@Component({
  selector: 'msh-exam-assignment-form',
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
    DialogModule,
    A1zStudentSearchComponent,
  ],
  templateUrl: './exam-assignment-form.component.html',
  styleUrls: ['./exam-assignment-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamAssignmentFormComponent implements OnInit, DoCheck, OnChanges {
  private studentList$$ = new BehaviorSubject<Student[]>([]);
  studentList$ = this.studentList$$.asObservable();
  totalRecords = 0;

  @Input() examDates: DropdownModel<number>[] = [];
  @Input() students: DropdownModel<number>[] = [];
  @Input() examAssignments: DropdownModel<number>[] = [];
  @Input() examSites: DropdownModel<number>[] = [];
  examDatesFiltered: DropdownModel<number>[] = [];

  @Input() set examAssignmentsDetails(details: ExamAssignment | null) {
    if (details) {
      this.examAssignment = Object.assign({}, details);
    }
  }

  @Output() gridEvent = new EventEmitter<GridEvent<Student | Student[]>>();
  @Output() formSave = new EventEmitter<ExamAssignment>();
  @Output() formClose = new EventEmitter<undefined>();
  @Output() loadExamDates = new EventEmitter<ExamAssignment>();

  @ViewChild('form', { static: true }) form!: NgForm;
  filters: LazyLoadEvent | null = null;
  submitted = false;
  saving = false;
  displayModal = false;
  selectedStudent: any = null;
  studentInputData = '';
  formId: string | null;

  selectedExamAssignmentId = this.route.snapshot.params['id'];
  //selectedStudentId = this.route.snapshot.params['studentId']

  examAssignment: ExamAssignment = {
    id: 0,
    studentId: '',
    studentIdentifier: '',
    studentName: '',
    examDateId: 0,
    date: new Date(),
    studentInputData: '',
    examSiteId: 0,
    examSiteName: '',
    examTypeDateTime: '',
    takenSeats: 0,
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private readonly examAssignmentService: ExamAssignmentApiService,
    private readonly studentService: StudentsApiService,
    private readonly toastService: GlobalToastService,
    private readonly examDateService: ExamDateApiService,
    private readonly examSiteService: ExamSiteApiService,
    private readonly activatedRoute: ActivatedRoute
  ) {
    this.formId = this.activatedRoute.snapshot.paramMap.get('id');
  }

  onNewClick() {
    this.displayModal = true;
  }

  onModalClose() {
    this.displayModal = false;
  }

  onCancelClick() {
    this.formClose.emit();
  }

  onSiteChange($event: any) {
    this.examDatesFiltered = this.examDates.filter(
      ed => ed.parentKey == $event.value
    );
  }

  ngOnChanges(): void {
    if (this.examDates && this.examAssignment.examSiteId) {
      this.onSiteChange({ value: this.examAssignment.examSiteId });
    }
  }
  refreshExamDates() {
    this.loadExamDates.emit(Object.assign({}, this.examAssignment));
  }
  ngOnInit(): void {
    if (this.selectedStudent) {
      this.onStudentChange(this.selectedStudent);
    } else {
      this.getExamDate();
      this.getExamSite();
    }
    // if (this.formId) {
    //   this.getExamAssignmentById();
    // }
  }

  // getExamAssignmentById() {
  //   this.examAssignmentService
  //     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  //     .getById(parseInt(this.formId!))
  //     .subscribe(response => {
  //       this.examAssignment = response.data;
  //       this.cd.detectChanges();
  //     });
  // }

  getExamDate() {
    this.examDateService.loadDropdownList().subscribe(response => {
      this.examDates = response.data;
    });
  }
  getExamSite() {
    this.examSiteService.loadDropdownList().subscribe(response => {
      this.examSites = response.data;
    });
  }
  onGridEvent(event: GridEvent<Student | Student[]>) {
    switch (event.action) {
      case GRID_ACTIONS.EDIT:
        this.selectedStudent = Object.assign({}, event.data);
        this.setStudent(this.selectedStudent);
        this.displayModal = false;
        break;
    }
  }

  ngDoCheck(): void {
    if (this.examAssignment.studentId !== undefined) {
      this.setStudent(null);
    }
    if (this.selectedStudent !== null) {
      this.onStudentChange(this.selectedStudent);
    }
  }

  setStudent(student: any) {
    if (!student) {
      this.studentInputData = '';
    } else {
      this.examAssignment.studentId = student.studentId;
      this.studentInputData = `${student?.studentIdentifier}-${student?.firstName}-${student?.middleName}-${student?.lastName}`;
    }
  }
  onStudentChange(student: Student) {
    if (!student) {
      this.examAssignment.studentInputData = ' ';
    } else {
      this.examAssignment.studentId = student.id;
      this.studentInputData = `${student?.studentId}-${student?.firstName}-${student?.middleName}-${student?.lastName}`;
    }
  }

  getStudents($event: LazyLoadEvent): void {
    this.filters = Object.assign({}, $event);

    this.studentService
      .loadStudents($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.studentList$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.examAssignment);
    }
  }
}
