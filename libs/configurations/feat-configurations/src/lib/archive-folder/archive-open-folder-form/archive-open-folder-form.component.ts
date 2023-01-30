import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ArchiveFolder } from '@msh/configurations/domain-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { Router } from '@angular/router';
import {
  AcademicYearApiService,
  ArchiveFolderApiService,
  GendersApiService,
  HighSchoolApiService,
  ProfileApiService,
  StudentsApiService,
} from '@msh/configurations/data-access-configurations';

@Component({
  selector: 'msh-archive-open-folder-form',
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
  ],
  templateUrl: './archive-open-folder-form.component.html',
  styleUrls: ['./archive-open-folder-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchiveOpenFolderFormComponent implements OnChanges {
  @Input() examTypes: DropdownModel<number>[] = [];
  @Input() examSubjects: DropdownModel<number>[] = [];
  @Output() examTypeChanged = new EventEmitter<string>();
  @Output() examSubjectChanged = new EventEmitter<string>();

  @Input() set archiveFolders(details: ArchiveFolder | null) {
    if (details) {
      this.archiveFolder = Object.assign({}, details);
    }
  }
  @Output() formSave = new EventEmitter<ArchiveFolder>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;
id: any;

  submitted = false;
  saving = false;
  examTypeId: any;
  examSubjectId: any;
  archiveFolder: ArchiveFolder = {
    nr: 0,
    isClosed: false,
    lastUserId: undefined,
    id: 0,
    examTypeId: 0,
    examSubjectId: ""
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    private cd: ChangeDetectorRef,
    private router: Router,

  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.examTypeId = this.archiveFolder.examTypeId;
    this.examSubjectId = this.archiveFolder.examSubjectId;
    this.cd.detectChanges();
  }

  onCancelClick() {
    this.formClose.emit();
  }


  onOpen(): void {
    const data = {...this.archiveFolder};
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.archiveFolder);



      // this.archiveFolderService.save(data).subscribe({
      //   next: () => {
      //     this.saving = false;

      this.router.navigate(['/configurations/add-barCode',this.archiveFolder.id]).then();
    }
  }

  onExamTypeChanged($event: any): void {
    this.examTypeChanged.emit(this.examTypeId);
  }

  onExamSubjectChanged($event: any): void {
    this.examSubjectChanged.emit(this.examSubjectId);
  }
}
