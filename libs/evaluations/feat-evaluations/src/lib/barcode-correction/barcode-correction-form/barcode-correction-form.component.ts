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
import { ArchiveExam } from '@msh/evaluations/domain-evaluations';
import {DropdownModel} from "@msh/shared/data-access-shared";
import {
   ExamTypeApiService,
} from "@msh/configurations/data-access-configurations";

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

  @Input() set archiveExamDetails(details: ArchiveExam | null) {
    if (details) {
      this.archiveExam = Object.assign({}, details);
    }
  }

  @Output() formSave = new EventEmitter<ArchiveExam>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  submitted = false;

  archiveExam: ArchiveExam = {id: undefined, archiveFolderId: 0 };
  constructor(
    private cd: ChangeDetectorRef,
    private readonly examTypeService: ExamTypeApiService,
  ) {}
  ngOnInit(): void {
    this.examTypeService.loadDropdownList().subscribe(response => {
      this.examTypes = [...response.data];
      this.cd.detectChanges();
    });
  }

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.archiveExam);
    }
  }
}
