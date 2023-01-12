import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
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
  ],
  templateUrl: './administration-office-form.component.html',
  styleUrls: ['./administration-office-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdministrationOfficeFormComponent {
  @Input() cities: DropdownModel<number>[] = [];

  @Input() set administrativeOffices(details: AdministrationOffice | null) {
    if (details) {
      this.administrationOffice = Object.assign({}, details);
    }
  }
  @Output() formSave = new EventEmitter<AdministrationOffice>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  citiesFiltered: DropdownModel<number>[] = [];

  submitted = false;

  administrationOffice: AdministrationOffice = {
    id: 0,
    name: '',
    isRegionalOffice: false,
    directorName: '',
    signature:'',
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private cd: ChangeDetectorRef) {}


  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.administrationOffice);
    }
  }

}
