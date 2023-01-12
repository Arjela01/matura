import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { AdministrationOffice } from '@msh/configurations/domain-configurations';
import { FormsModule, NgForm } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'msh-administration-office-form',
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
    FileUploadModule,
  ],
  templateUrl: './administration-office-form.component.html',
  styleUrls: ['./administration-office-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdministrationOfficeFormComponent {
  @Input() cities: DropdownModel<number>[] = [];
  @Input() dars: DropdownModel<number>[] = [];
  @Input() set administrativeOffices(details: AdministrationOffice | null) {
    if (details) {
      this.administrationOffice = Object.assign({}, details);
    }
  }
  @Output() formSave = new EventEmitter<AdministrationOffice>();
  @Output() formClose = new EventEmitter<undefined>();
  uploaded = false;
  @ViewChild('form', { static: true }) form!: NgForm;

  submitted = false;

  administrationOffice: AdministrationOffice = {
    id: 0,
    name: '',
    isRegionalOffice: false,
    directorName: '',
    signature: '',
    cityId: 0,
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private cd: ChangeDetectorRef) {}

  onCancelClick() {
    this.formClose.emit();
  }
  selectFiles(event: any) {
    let that = this;
    let fileReader = new FileReader();
    for (let file of event.files) {
      fileReader.readAsDataURL(file);
      that.uploaded = true;
      fileReader.onload = function () {
        // Will upload the base64 here.
        if (fileReader.result) {
          var parts = fileReader.result.toString().split(';base64,');
          let parsedBase64 = parts[1];
          that.administrationOffice.signature = parsedBase64 as string;
        }
      };
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid && this.administrationOffice.signature) {
      if (this.administrationOffice.id === 0) {
        delete this.administrationOffice.id;
      }
      this.formSave.emit(this.administrationOffice);
    }
  }
}
