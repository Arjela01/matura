import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ExamAssignment, Student } from '@msh/shared/domain-models';
import { GridEvent } from '@msh/shared/util-shared';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';

import { UntilDestroy } from '@ngneat/until-destroy';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableLazyLoadEvent } from 'primeng/table';

@UntilDestroy()
@Component({
  selector: 'msh-assign-all-form',
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
    AssignAllFormComponent,
    FileUploadModule,
    MultiSelectModule,
  ],
  templateUrl: './assign-all-form.component.html',
  styleUrls: ['./assign-all-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignAllFormComponent {
  @Input() examDates: DropdownModel<number>[] = [];
  @Input() examSites: DropdownModel<any>[] = [];
  @Input() administrationOffices: any;
  @Input() schoolProfile: DropdownModel<any>[] = [];
  @Input() set examAssignmentsDetails(details: ExamAssignment | null) {
    if (details) {
      this.examAssignment = Object.assign({}, details);
    }
  }

  @Output() gridEvent = new EventEmitter<GridEvent<Student | Student[]>>();
  @Output() formSave = new EventEmitter<ExamAssignment>();
  @Output() formClose = new EventEmitter<undefined>();
  @Output() loadExamSites = new EventEmitter<ExamAssignment>();
  @Output() administrationOfficeChanged = new EventEmitter<number>();
  @Output() examSiteChanged = new EventEmitter<string[]>();
  @Output() examDateChanged = new EventEmitter<any>();
  @Output() schoolProfileChanged = new EventEmitter<any>();

  @ViewChild('form', { static: true }) form!: NgForm;
  filters: TableLazyLoadEvent | null = null;
  submitted = false;
  displayAssignAllModal = false;
  fileContent: string | ArrayBuffer | null | undefined;
  administrationOfficeId = 0;
  schoolProfileId = 0;
  examSiteId = [''];
  examDateId = 0;

  examAssignment: ExamAssignment = {
    date: new Date(),
    examDateId: 0,
    examSiteId: '',
    id: '',
    studentId: '',
    studentIdentifier: '',
    studentInputData: '',
    studentName: '',
    time: '',
    schoolProfileId: 0,
    maxStudentsToAssign: 0
  };
  assigned = false;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() { }

  onCancelClick() {
    this.formClose.emit();
    this.displayAssignAllModal = false;
  }
  onAdministrationOfficeChanged($event: any): void {
    if ($event && $event.value) {
      this.administrationOfficeId = $event.value;
      this.administrationOfficeChanged.emit(this.administrationOfficeId);
      this.examAssignment.administrationOfficeId = this.administrationOfficeId;
    }
  }
  onExamSiteChanged($event: any): void {
    if ($event && $event.value) {
      this.examSiteId = $event.value;
      this.examSiteChanged.emit(this.examSiteId);
      this.examAssignment.examSiteId = this.examSiteId;
    }
  }
  onExamDateChanged($event: any): void {
    if ($event && $event.value) {
      this.examDateId = $event.value;
      this.examDateChanged.emit(this.examDateId);
      this.examAssignment.examDateId = this.examDateId;
    }
  }
  onSchoolProfileChanged($event: any): void {
    if ($event && $event.value) {
      this.schoolProfileId = $event.value;
      this.schoolProfileChanged.emit(this.schoolProfileId);
      this.examAssignment.schoolProfileId = this.schoolProfileId;
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.examAssignment);
    }
  }
}
