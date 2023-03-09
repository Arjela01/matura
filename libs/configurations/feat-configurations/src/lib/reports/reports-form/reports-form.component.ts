import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Reports } from '@msh/configurations/domain-configurations';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'msh-reports-form',
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
    MultiSelectModule,
  ],
  templateUrl: './reports-form.component.html',
  styleUrls: ['./reports-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsFormComponent {
  @Input() set reportsDetails(details: Reports | null) {
    if (details) {
      this.reports = Object.assign({}, details);
      Object.entries(this.reports.roles).forEach(([key, value]) =>
        this.rolesArray.push({ key, value, parentKey: null })
      );
    }
  }
  @Input() rolesDropdown: any[] = [];

  @Output() formSave = new EventEmitter<Reports>();
  @Output() formClose = new EventEmitter<undefined>();
  rolesArray: any[] = [];
  @ViewChild('form', { static: true }) form!: NgForm;

  submitted = false;

  reports: Reports = {
    id: '',
    name: '',
    path: '',
    roles: {},
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private cd: ChangeDetectorRef) {
    console.log(this.rolesDropdown);
  }

  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      const convMap: any = {};
      this.reports.roles = new Map(
        this.rolesArray.map(obj => [obj.key, obj.value])
      );
      this.reports.roles.forEach((val: string, key: string) => {
        convMap[key] = val;
      });
      this.reports.roles = convMap;
      this.formSave.emit(this.reports);
    }
  }
}
