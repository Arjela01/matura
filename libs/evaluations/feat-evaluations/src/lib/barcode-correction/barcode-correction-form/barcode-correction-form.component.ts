import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { ArchiveFolder} from '@msh/evaluations/domain-evaluations';
import {DropdownModel} from "@msh/shared/data-access-shared";
import {
   ExamTypeApiService,
} from "@msh/configurations/data-access-configurations";
import {ArchiveFolderApiService} from "@msh/evaluations/data-access-evaluations";

@Component({
  selector: 'msh-barcode-correction-form',
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
  templateUrl: './barcode-correction-form.component.html',
  styleUrls: ['./barcode-correction-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarcodeCorrectionFormComponent  {
  @Input() examTypes: DropdownModel<number>[] = [];
  @Input() archiveFolders: DropdownModel<number>[] = [];

  @Input() set archiveFolderDetails(details: ArchiveFolder | null) {
    if (details) {
      this.archiveFolder = Object.assign({}, details);
    }
  }

  @Output() formSave = new EventEmitter<ArchiveFolder>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  submitted = false;

  archiveFolder: ArchiveFolder = {};
  constructor(
    private cd: ChangeDetectorRef,
    private readonly examTypeService: ExamTypeApiService,
    private readonly archiveFolderService: ArchiveFolderApiService,
  ) {}
  ngOnInit(): void {
    this.examTypeService.loadDropdownList().subscribe(response => {
      this.examTypes = [...response.data];
      this.cd.detectChanges();
    });
    this.archiveFolderService.loadDropdownList().subscribe(response => {
      this.archiveFolders = [...response.data];
      this.cd.detectChanges();
    });
  }

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.archiveFolder);
    }
  }
}
