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
import { DashboardItems, DashboardSectionOptionsModel,} from '@msh/shared/domain-models';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';

import { SharedStudentLookupModule } from '@msh/shared/student-lookup';
import { DialogModule } from 'primeng/dialog';
import {FileUploadModule} from "primeng/fileupload";

import {DropdownModel} from "@msh/shared/data-access-shared";
import {AutoCompleteModule} from "primeng/autocomplete";
import {MultiSelectModule} from "primeng/multiselect";
import {UntilDestroy} from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: 'msh-dashboard-items-form',
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
    DialogModule,
    SharedStudentLookupModule,
    FileUploadModule,
    AutoCompleteModule,
    MultiSelectModule,
  ],
  templateUrl: './dashboard-items-form.component.html',
  styleUrls: ['./dashboard-items-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardItemsFormComponent {
  @Input() Users: DropdownModel<number>[] = [];
  @Input() roles: DropdownModel<number>[] = [];
  sectionDashboard = DashboardSectionOptionsModel.All;
  @Input() set setDashboardItemsDetails(details: DashboardItems | null) {
    if (details) {
      this.dashboardItems = Object.assign({}, details);
    }
  }
  @Output() formSave = new EventEmitter<DashboardItems>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  submitted = false;


  // eslint-disable-next-line @typescript-eslint/member-ordering
  dashboardItems: DashboardItems = {
    dashboardSectionId: 0,
    dashboardSectionName: "",
    description: "",
    document: 0,
    documentName: "",
    endDate: [],
    linkUrl: "",

    startDate: [],
    title: "",

  };
  uploaded= false;


  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.dashboardItems);
    }
  }
}
