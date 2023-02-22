import { CommonModule, formatDate } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {DashboardSectionModel, Student, StudentBan} from '@msh/shared/domain-models';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { GRID_ACTIONS, GridEvent } from '@msh/shared/util-shared';
import { LazyLoadEvent } from 'primeng/api';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject } from 'rxjs';
import { StudentsApiService } from '@msh/configurations/data-access-configurations';
import { SharedStudentLookupModule } from '@msh/shared/student-lookup';
import { DialogModule } from 'primeng/dialog';
import {FileUploadModule} from "primeng/fileupload";

import {DropdownModel} from "@msh/shared/data-access-shared";
import {AutoCompleteModule} from "primeng/autocomplete";
import {MultiSelectModule} from "primeng/multiselect";

@UntilDestroy()
@Component({
  selector: 'msh-dynamic-dashboard-form',
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
    FileUploadModule,
    AutoCompleteModule,
    MultiSelectModule,
  ],
  templateUrl: './dynamic-dashboard-form.component.html',
  styleUrls: ['./dynamic-dashboard-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicDashboardFormComponent  implements OnInit, DoCheck {
  @Input() roles: DropdownModel<number>[] = [];


  private studentList$$ = new BehaviorSubject<Student[]>([]);
  studentList$ = this.studentList$$.asObservable();
  totalRecords = 0;
  sectionDashboard = DashboardSectionModel.All;

  selectedStudent: any = null;
  displayStudentModal = false;
  studentInputData = '';
  rolesFiltered: DropdownModel<number>[] = [];

  effectiveDate: any;
  banRemovalDate: any;
  filters: LazyLoadEvent | null = null;

  @Input() set bannedStudentsDetails(details: StudentBan | null) {
    if (details) {
      this.studentBan = Object.assign({}, details);
      this.effectiveDate = formatDate(
        new Date(this.studentBan.effectiveDate),
        'dd/MM/yyyy',
        'en'
      );
      this.banRemovalDate = formatDate(
        new Date(this.studentBan.banRemovalDate),
        'dd/MM/yyyy',
        'en'
      );
    }
  }

  @Output() formSave = new EventEmitter<StudentBan>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', {static: true}) form!: NgForm;
  uploaded = false;

  submitted = false;
  studentBan: StudentBan = {
    id: 0,
    studentId: '',
    studentIdentifier: '',
    studentInputData: '',
    studentName: '',
    description: '',
    isBanned: 0,
    effectiveDate: new Date(),
    banRemovalDate: new Date(),

  };

  constructor(
    private cd: ChangeDetectorRef,
    private readonly studentService: StudentsApiService
  ) {
  }




  selectFiles(event: any) {
    const fileReader = new FileReader();
    for (const file of event.files) {
      fileReader.readAsDataURL(file);
      this.uploaded = true;
    }
  }



  onCancelClick() {
    this.formClose.emit();
  }
  onNewClick() {
    this.displayStudentModal = true;
  }
  onModalClose() {
    this.displayStudentModal = false;
  }

  setStudent(student: any) {
    if (!student) {
      this.studentInputData = '';
    } else {
      this.studentBan.studentId = student.studentId;
      this.studentBan.studentIdentifier = student.studentIdentifier;
      this.studentInputData = `${student?.studentName}`;
    }
  }
  onStudentChange(student: Student) {
    if (!student) {
      this.studentBan.studentInputData = ' ';
    } else {
      this.studentBan.studentId = student.id;
      // eslint-disable-next-line max-len
      this.studentInputData = `${student?.studentId}-${student?.firstName}-${student?.middleName}-${student?.lastName}`;
    }
  }

  ngOnInit(): void {
    if (this.selectedStudent) {
      this.onStudentChange(this.selectedStudent);
    }
  }


  onGridEvent(event: GridEvent<Student | Student[]>) {
    switch (event.action) {
      case GRID_ACTIONS.EDIT:
        this.selectedStudent = Object.assign({}, event.data);
        this.setStudent(this.selectedStudent);
        this.displayStudentModal = false;
        break;
    }
  }
  ngDoCheck(): void {
    if (this.studentBan.studentId !== undefined) {
      this.studentBan.studentIdentifier = this.selectedStudent?.studentId;
      this.setStudent(this.studentBan);
    }
    if (this.selectedStudent !== null) {
      this.onStudentChange(this.selectedStudent);
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
  ngOnChanges(): void {
    if (this.roles && this.studentBan.studentName) {
      this.onRoleChange({ value: this.studentBan.studentName });
    }
  }

  onRoleChange($event: any) {
    this.rolesFiltered = this.roles.filter(
      et => et.parentKey == $event.value
    );
  }

onSubmit() {
    if (this.form.valid) {
      this.formSave.emit(this.studentBan);
    }
  }
}
