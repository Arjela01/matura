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
import { DataExport } from '@msh/shared/domain-models';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'msh-data-export-form',
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
    MultiSelectModule,
  ],
  templateUrl: './data-export-form.component.html',
  styleUrls: ['./data-export-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataExportFormComponent implements OnChanges {
  @Input() roles: DropdownModel<number>[] = [];

  @Input() set dataExportDetails(details: DataExport | null) {
    if (details) {
      this.dataExport = Object.assign({}, details);
    }
  }

  @Output() formSave = new EventEmitter<DataExport>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  submitted = false;

  dataExport: DataExport = {
    id: 0,
    displayOrder: 0,
    isVisible: false,
    procedure: '',
    text: '',
    roles: [],
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private cd: ChangeDetectorRef) {}

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.dataExport);
    }
  }

  ngOnChanges(): void {
    this.cd.detectChanges();
  }
}
