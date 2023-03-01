import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  Input, OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { DashboardItems,} from '@msh/shared/domain-models';

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
import {
  AcademicYearApiService, DashboardSectionApiService, GendersApiService,
  HighSchoolApiService, ProfileApiService, RolesApiService,
  StudentsApiService, UserApiService
} from "@msh/configurations/data-access-configurations";
import {Router} from "@angular/router";

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
export class DashboardItemsFormComponent implements OnInit{
  @Input() roles: DropdownModel<number>[] = [];
  @Input() users: DropdownModel<number>[] = [];
  sectionDashboard: DropdownModel<number>[] = [];

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
    id: 0,
    dashboardSectionId: 0,
    description: "",
    documentName: "",
    endDate: [],
    linkUrl: "",
    startDate: [],
    roles: [],
    users: [],
    title: ""
  };
  uploaded= false;


  onCancelClick() {
    this.formClose.emit();
  }

  constructor(
    private cd: ChangeDetectorRef,
    private readonly dashboardSectionService: DashboardSectionApiService,
    private readonly rolesServices: RolesApiService,
    private readonly usersServices: UserApiService,

  ) {}
  ngOnInit(): void {
    this.dashboardSectionService.loadDropdownList().subscribe(response => {
      this.sectionDashboard = [...response.data];
      this.cd.detectChanges();
    });
    this.rolesServices.loadDropdownList().subscribe(response => {
      this.roles = [...response.data];
      this.cd.detectChanges();
    });
    this.usersServices.loadDropdownList().subscribe(response => {
      this.users = [...response.data];
      this.cd.detectChanges();
    });
  }

  selectFiles(event: any) {
    const fileReader = new FileReader();
    for (const file of event.files) {
      fileReader.readAsDataURL(file);
      this.uploaded = true;
      fileReader.onload = () => {
        if (fileReader.result) {
          const parts = fileReader.result.toString().split(';base64,');
          const parsedBase64 = parts[1];
          this.dashboardItems.document = parsedBase64 as string;
        }
      };
    }
  }
  onSubmit() {
    this.submitted = true;
    if (this.form.valid && this.dashboardItems.document) {
      if (this.dashboardItems.id === 0) {
        delete this.dashboardItems.id;
      }
      this.formSave.emit(this.dashboardItems);
    }
  }
}
