import {
  ChangeDetectionStrategy,
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
import { ArchiveExam } from '@msh/shared/domain-models';
import {TooltipModule} from "primeng/tooltip";

@Component({
  selector: 'msh-archive-exam-form',
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
    TooltipModule,
  ],
  templateUrl: './archive-form.component.html',
  styleUrls: ['./archive-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchiveFormComponent {
  @Input() set archiveExamDetails(details: ArchiveExam | null) {
    if (details) {
      this.archiveExam = Object.assign({}, details);
    }
  }

  @Output() formSave = new EventEmitter<ArchiveExam>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  submitted = false;

  archiveExam: ArchiveExam = {
    archiveFolderNr: 0,
    id: undefined,
    archiveFolderId: 0,
  };

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
