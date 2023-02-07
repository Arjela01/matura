import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ExamAssignment, Student } from '@msh/shared/domain-models';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { GlobalToastService, GridEvent } from '@msh/shared/util-shared';
import {
  ExamAssignmentApiService,
  ExamDateApiService,
} from '@msh/configurations/data-access-configurations';

import { DialogModule } from 'primeng/dialog';
import { UntilDestroy } from '@ngneat/until-destroy';
import { LazyLoadEvent } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ExamAssignmentImportCommand } from '../../../../../domain-configurations/src/exam-assignment-import-command';

@UntilDestroy()
@Component({
  selector: 'msh-upload-form',
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
    UploadFormComponent,
    FileUploadModule,
  ],
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadFormComponent implements OnInit {
  @Input() examDates: DropdownModel<number>[] = [];
  @Input() set examAssignmentsDetails(details: ExamAssignment | null) {
    if (details) {
      this.command = Object.assign({}, details);
    }
  }

  @Output() gridEvent = new EventEmitter<GridEvent<Student | Student[]>>();
  @Output() formSave = new EventEmitter<ExamAssignment>();
  @Output() formClose = new EventEmitter<undefined>();
  @Output() loadExamSites = new EventEmitter<ExamAssignment>();

  @ViewChild('form', { static: true }) form!: NgForm;
  filters: LazyLoadEvent | null = null;
  submitted = false;
  displayUploadModal = false;
  fileContent: string | ArrayBuffer | null | undefined;

  command: ExamAssignmentImportCommand = {};
  uploaded = false;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    private cd: ChangeDetectorRef,
    private readonly examAssignmentService: ExamAssignmentApiService,
    private readonly toastService: GlobalToastService,
    private readonly examDateService: ExamDateApiService
  ) {}

  onCancelClick() {
    this.formClose.emit();
    this.displayUploadModal = false;
  }

  ngOnInit(): void {
    this.getExamDate();
  }

  getExamDate() {
    this.examDateService.loadDropdownList().subscribe(response => {
      this.examDates = response.data;
    });
  }

  onSubmit() {
    this.submitted = true;

    this.command.file = this.fileContent;
    this.examAssignmentService.import(this.command).subscribe(response => {
      if (response.isSuccessful) {
        this.toastService.showSuccess('Dokumenti u shtua me sukses!');
        this.formClose.emit();
        this.displayUploadModal = false;
      }
      if (response.isBadRequest)
        this.toastService.showError(
          'Ndodhi një problem gjatë ngarkimit të dokumentit!'
        );
    });
  }

  onUpload(event: any) {
    const file = event.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    this.uploaded = true;
    reader.onload = () => {
      const base64 = reader.result as string;
      this.fileContent = base64.split(',')[1];
    };
  }
}
