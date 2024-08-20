import {
  ChangeDetectorRef,
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import {
  DiplomaRequest,
  DiplomaRequestPostData,
  Student,
} from '@msh/shared/domain-models';
import { TableLazyLoadEvent } from 'primeng/table';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { FormsModule, NgForm } from '@angular/forms';
import {
  GRID_ACTIONS,
  GridEvent,
  UpperCaseInputDirective,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { StudentsAuditService } from '@msh/audit-logs/data-access-audit-log';
import { Button, ButtonDirective } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PaginatorModule } from 'primeng/paginator';
import { PrimeTemplate } from 'primeng/api';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SharedStudentLookupModule } from '@msh/shared/student-lookup';
import { FileUploadModule } from 'primeng/fileupload';
import { Ripple } from 'primeng/ripple';
import { DiplomaRequestApiService } from '@msh/applications/data-access-applications';

@UntilDestroy()
@Component({
  selector: 'msh-diploma-request-form',
  standalone: true,
  imports: [
    CommonModule,
    Button,
    ButtonDirective,
    CalendarModule,
    DialogModule,
    DropdownModule,
    FormsModule,
    InputTextModule,
    InputTextareaModule,
    PaginatorModule,
    PrimeTemplate,
    RadioButtonModule,
    SharedStudentLookupModule,
    UpperCaseInputDirective,
    FileUploadModule,
    Ripple,
  ],
  templateUrl: './diploma-request-form.component.html',
  styleUrl: './diploma-request-form.component.scss',
})
export class DiplomaRequestFormComponent implements OnInit, DoCheck {
  private studentList$$ = new BehaviorSubject<Student[]>([]);
  studentList$ = this.studentList$$.asObservable();
  filters: TableLazyLoadEvent | null = null;
  totalRecords = 0;
  selectedStudent: any = null;
  displayStudentModal = false;
  studentInputData = '';
  submitted = false;
  base64?: string;
  academicYearId!: number;

  @Input() diploma: DiplomaRequest = {} as DiplomaRequest;
  @Input() set diplomaDetails(details: DiplomaRequest | null) {
    if (details) {
      this.diplomaRequest = Object.assign({}, details);
    }
  }

  @Input() examTypes: DropdownModel<number>[] = [];

  @Output() formSave = new EventEmitter<DiplomaRequestPostData>();
  @Output() formClose = new EventEmitter<undefined>();
  @Output() clearSelectedStudent = new EventEmitter<undefined>();
  @ViewChild('form', { static: true }) form!: NgForm;

  diplomaRequest: DiplomaRequest = {} as DiplomaRequest;

  constructor(
    private cd: ChangeDetectorRef,
    private readonly studentHistoryService: StudentsAuditService,
    private readonly diplomaRequestService: DiplomaRequestApiService
  ) {
    const academicYear = JSON.parse(
      localStorage.getItem('academicYear') as string
    );
    if (academicYear) {
      this.academicYearId = academicYear.id;
    }
  }

  onCancelClick() {
    this.formClose.emit();
  }

  clearStudent() {
    this.selectedStudent = null;
    this.clearSelectedStudent.emit();
    this.cd.detectChanges();
  }

  onNewClick() {
    this.displayStudentModal = true;
    this.cd.markForCheck();
  }

  onModalClose() {
    this.displayStudentModal = false;
  }

  downloadFile() {
    const byteCharacters = atob(this.diplomaRequest.attachedDocument as any);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    const fileURL = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = fileURL;
    link.download = this.diplomaRequest.fileName as string;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(fileURL);
  }

  getDiplomaById(id: string): void {
    this.diplomaRequestService
      .getOne(id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.diplomaRequest.fileName = response.data.attachedDocumentFileName;
        this.diplomaRequest.attachedDocument = response.data.attachedDocument;
        this.cd.detectChanges();
      });
  }

  setStudent(student: any) {
    if (!student) {
      this.studentInputData = '';
      this.diplomaRequest.studentId = '';
    } else {
      this.diplomaRequest.studentId = student.studentId;
      if (this.diplomaRequest?.studentStudentId) {
        this.studentInputData = `${this.diplomaRequest?.studentStudentId}-${this.diplomaRequest?.studentFirstName}-${student?.studentLastName}-${student?.studentLastName}`;
      } else {
        this.studentInputData = '';
      }
    }
  }

  onStudentChange(student: Student) {
    if (!student) {
      this.diplomaRequest.studentInputData = ' ';
    } else {
      this.diplomaRequest.studentId = student.id;
      if (student?.studentId) {
        this.studentInputData = `${student?.studentId}-${student?.firstName}-${student?.middleName}-${student?.lastName}`;
      } else {
        this.diplomaRequest.studentInputData = '';
      }
    }
  }

  ngOnInit(): void {
    this.getDiplomaById(this.diplomaRequest.id);
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
    if (this.diplomaRequest.studentId !== undefined) {
      this.setStudent(this.diplomaRequest);
    }
    if (this.selectedStudent !== null) {
      this.onStudentChange(this.selectedStudent);
    }
  }

  getStudents($event: TableLazyLoadEvent): void {
    this.filters = Object.assign({}, $event);
    this.studentHistoryService
      .loadStudents($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.studentList$$.next(response.data);
        this.totalRecords = response.total;
        this.cd.detectChanges();
      });
  }

  onSubmit() {
    const valuesToSend: DiplomaRequestPostData = {
      id: this.diplomaRequest.id,
      studentID: this.diplomaRequest.studentId,
      fileName: this.diplomaRequest.fileName,
      attachedDocument: this.diplomaRequest.attachedDocument,
      academicYearId: this.academicYearId,
    };
    if (this.form.valid) {
      this.formSave.emit(valuesToSend);
    }
    this.cd.markForCheck();
  }

  handleUpload(data: any) {
    const file = data.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      this.base64 = base64.split(',')[1];
      this.diplomaRequest.attachedDocument = this.base64;
      this.diplomaRequest.fileName = file.name;
      this.cd.detectChanges();
    };
  }
}
