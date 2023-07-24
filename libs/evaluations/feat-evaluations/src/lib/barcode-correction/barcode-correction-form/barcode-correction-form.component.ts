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
import {ArchiveExam} from '@msh/evaluations/domain-evaluations';
import {TooltipModule} from "primeng/tooltip";

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
    TooltipModule
  ],
  templateUrl: './barcode-correction-form.component.html',
  styleUrls: ['./barcode-correction-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarcodeCorrectionFormComponent   {
  @Input() set archiveExamDetails(details: ArchiveExam | null) {
    if (details) {
      this.archiveExam = Object.assign({}, details);
    }
  }

  @Output() formSave = new EventEmitter<ArchiveExam>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  submitted = false;

  archiveExam: ArchiveExam = {archiveFolderNr: 0, id: undefined, archiveFolderId: 0 };

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.archiveExam);
    }
  }

  lettersNumbersCheck(input: any) {
    const numberRegex = /\d/;
    const characterRegex = /[a-zA-Z]/;
    const barcode = this.archiveExam?.barcode;
    return (
      barcode &&
      barcode.length === 7 &&
      numberRegex.test(input) &&
      characterRegex.test(input)
    );
  }
}
