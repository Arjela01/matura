import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AdministrationOffice } from '@msh/shared/domain-models';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';

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
  ngOnInit() {
    console.log(this.cities);
  }
  onCancelClick() {
    this.formClose.emit();
  }

  selectFiles(event: any) {
    const fileReader = new FileReader();
    for (const file of event.files) {
      fileReader.readAsDataURL(file);
      this.uploaded = true;
      fileReader.onload = () => {
        // Will upload the base64 here.
        if (fileReader.result) {
          const parts = fileReader.result.toString().split(';base64,');
          const parsedBase64 = parts[1];
          this.administrationOffice.signature = parsedBase64 as string;
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
