import { CommonModule, formatDate } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input, OnChanges,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {AcademicYear, DashboardSection, DashboardSectionModel,} from '@msh/shared/domain-models';

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
  selector: 'msh-dashboard-section-form',
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
  templateUrl: './dashboard-section-form.component.html',
  styleUrls: ['./dashboard-section-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardSectionFormComponent  {
  @Input() roles: DropdownModel<number>[] = [];
  sectionDashboard = DashboardSectionModel.All;
  @Input() set setDashboardSectionDetails(details: DashboardSection | null) {
    if (details) {
      this.dashboardSection = Object.assign({}, details);
    }
  }
  @Output() formSave = new EventEmitter<DashboardSection>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  submitted = false;


  // eslint-disable-next-line @typescript-eslint/member-ordering
  dashboardSection: DashboardSection = {
    name:'',
    roles: [],
  };


  onCancelClick() {
    this.formClose.emit();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.formSave.emit(this.dashboardSection);
    }
  }
}
