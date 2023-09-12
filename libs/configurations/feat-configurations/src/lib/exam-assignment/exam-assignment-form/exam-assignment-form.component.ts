import { CommonModule } from '@angular/common';
import {
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
import { ActivatedRoute } from '@angular/router';
import {
  ExamDateApiService,
  ExamSiteApiService,
  StudentsApiService,
} from '@msh/configurations/data-access-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ExamAssignment, Student } from '@msh/shared/domain-models';
import { SharedStudentLookupModule } from '@msh/shared/student-lookup';
import { GRID_ACTIONS, GridEvent } from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableLazyLoadEvent } from 'primeng/table';
import { BehaviorSubject } from 'rxjs';

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
    SharedStudentLookupModule,
  ],
  templateUrl: './exam-assignment-form.component.html',
  styleUrls: ['./exam-assignment-form.component.scss'],
})
export class ExamAssignmentFormComponent implements OnInit, DoCheck, OnChanges {
  private studentList$$ = new BehaviorSubject<Student[]>([]);
  studentList$ = this.studentList$$.asObservable();
  totalRecords = 0;

  @Input() examDates: DropdownModel<number>[] = [];
  @Input() students: DropdownModel<number>[] = [];
  @Input() examAssignments: DropdownModel<number>[] = [];
  @Input() examSites: DropdownModel<string>[] = [];
  examDatesFiltered: DropdownModel<number>[] = [];
  hasAdditionalValue: any;

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
  filters: TableLazyLoadEvent | null = null;
  submitted = false;
  displayModal = false;
  selectedStudent: any = null;
  studentInputData = '';
  formId: string | null;

  examAssignment: ExamAssignment = {
    id: '',
    studentId: '',
    studentIdentifier: '',
    studentName: '',
    examDateId: 0,
    date: new Date(),
    studentInputData: '',
    examSiteName: '',
    examSiteId: '',
    examTypeDateTime: '',
    takenSeats: 0,
    time: '',
  };

  constructor(
    private readonly studentService: StudentsApiService,
    private readonly examDateService: ExamDateApiService,
    private readonly examSiteService: ExamSiteApiService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly cd: ChangeDetectorRef
  ) {
    this.formId = this.activatedRoute.snapshot.paramMap.get('id');
  }

  onSearchClick() {
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
    this.getExamDate(this.examAssignment.examSiteId);
  }

  ngOnInit(): void {
    if (this.selectedStudent) {
      this.onStudentChange(this.selectedStudent);
    } else {
      this.getExamSite();
      if (this.examAssignment.examSiteId) {
        this.getExamDate(this.examAssignment.examSiteId);
      } else {
        this.examDates = [];
      }
    }
  }

  getExamDate(examSiteId: string): void {
    this.examDateService.forExamSiteId(examSiteId).subscribe(response => {
      const currentDate = new Date();

      const futureExamDates = response.data.filter((item: any) => {
        const dateStr = item.value;
        const regex = /(\d{2}\.\d{2}.\d{4}) @ (\d{2}:\d{2})/;
        const match = dateStr.match(regex);

        if (match) {
          const datePart = match[1];
          const timePart = match[2];
          const [day, month, year] = datePart.split('.').map(Number);
          const [hours, minutes] = timePart.split(':').map(Number);
          const examDate = new Date(year, month - 1, day, hours, minutes);

          return examDate >= currentDate;
        }

        return false;
      });
      this.examDates = [...futureExamDates];
      this.cd.markForCheck();
    });
  }
  getExamSite() {
    this.examSiteService.loadDropdownList().subscribe(response => {
      this.examSites = response.data;
      this.cd.markForCheck();
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
      this.setStudent(this.examAssignment);
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
      this.studentInputData = student?.studentName;
    }
  }
  onStudentChange(student: Student) {
    if (!student) {
      this.examAssignment.studentInputData = ' ';
    } else {
      this.examAssignment.studentId = student.id;
      // eslint-disable-next-line max-len
      this.studentInputData = `${student?.studentId}-${student?.firstName}-${student?.middleName}-${student?.lastName}`;
    }
  }

  getValue(event: any) {
    this.hasAdditionalValue = this.examDates.find(
      item => item.key === event.value
    );
  }

  getStudents($event: TableLazyLoadEvent): void {
    this.filters = Object.assign({}, $event);
    const params = {
      isFall: !!this.hasAdditionalValue?.additionalValue?.includes('True'),
    };
    this.studentService
      .loadStudents($event, params)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.studentList$$.next(response.data);
        this.totalRecords = response.total;
        this.cd.markForCheck();
      });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.examAssignment);
    }
  }
}
