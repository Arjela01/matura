import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
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
  @Input() examSubject: DropdownModel<number>[] = [];
  @Input() examVersion: DropdownModel<number>[] = [];

  @Input() set archiveFolders(details: ArchiveFolder | null) {
    if (details) {
      this.archiveFolder = Object.assign({}, details);
    }
  }
  @Output() formSave = new EventEmitter<ArchiveFolder>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  examTypesFiltered: DropdownModel<number>[] = [];
  examSubjectsFiltered: DropdownModel<number>[] = [];

  submitted = false;

  archiveFolder: ArchiveFolder = {
    id: 0,
    name: '',
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    private cd: ChangeDetectorRef,
    private readonly academicYearService: AcademicYearApiService,
    private readonly studentService: StudentsApiService,
    private readonly highSchoolService: HighSchoolApiService,
    private readonly profileService: ProfileApiService,
    private readonly genderService: GendersApiService,
    private router: Router,
    private archiveFolderService: ArchiveFolderApiService
  ) {}

  ngOnChanges(): void {
    if (this.examTypes && this.archiveFolder.id) {
      this.onExamTypeChange({ value: this.archiveFolder.id });
    }
    if (this.examVersion && this.archiveFolder.id) {
      this.onExamVersionChange({ value: this.archiveFolder.id });
    }
    if (this.examSubject && this.archiveFolder.id) {
      this.onExamSubjectChange({ value: this.archiveFolder.id });
    }
  }

  onCancelClick() {
    this.formClose.emit();
  }

  onOpen(): void {
    const data = { ...this.archiveFolder };

    this.archiveFolderService.save(data).subscribe({
      next: () => {
        this.submitted = false;

        this.router.navigate(['/configurations/students']).then();
      },
    });
  }

  onExamTypeChange($event: any) {
    this.examTypesFiltered = this.examTypes.filter(
      c => c.parentKey == $event.value
    );
  }
  onExamVersionChange($event: any) {
    this.examTypesFiltered = this.examTypes.filter(
      c => c.parentKey == $event.value
    );
  }
  onExamSubjectChange($event: any) {
    this.examSubjectsFiltered = this.examSubject.filter(
      c => c.parentKey == $event.value
    );
  }
}
