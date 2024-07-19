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
import { ActivatedRoute } from '@angular/router';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ArchiveFolder } from '@msh/shared/domain-models';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';

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
  @Input() examSubjects: DropdownModel<string>[] = [];
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

  submitted = false;
  saving = false;

  archiveFolder: ArchiveFolder = {
    nr: 0,
    isClosed: false,
    lastUserId: undefined,
    totalArchiveExams: 0
  };
  examTypeId: any;
  examSubjectId: any;

  constructor(
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {
    this.archiveFolder.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.examTypeId = this.archiveFolder.examTypeId;
    this.examSubjectId = this.archiveFolder.examSubjectId;
    this.cd.detectChanges();
  }

  onCancelClick() {
    this.formClose.emit();
  }

  onOpen(): void {
    this.archiveFolder = { ...this.archiveFolder };
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.archiveFolder);
    }
  }

  onExamTypeChanged($event: any): void {
    this.examTypeId = $event.value;
    this.examTypeChanged.emit(this.examTypeId);
  }

  onExamSubjectChanged($event: any): void {
    this.examSubjectId = $event.value;
    this.examSubjectChanged.emit(this.examSubjectId);
  }
}
