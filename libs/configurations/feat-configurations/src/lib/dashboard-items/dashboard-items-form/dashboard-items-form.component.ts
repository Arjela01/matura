import { CommonModule, formatDate } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { DashboardItem } from '@msh/shared/domain-models';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';

import { SharedStudentLookupModule } from '@msh/shared/student-lookup';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';

import { DropdownModel } from '@msh/shared/data-access-shared';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MultiSelectModule } from 'primeng/multiselect';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  DashboardSectionApiService,
  RolesApiService,
  UserApiService,
} from '@msh/configurations/data-access-configurations';
import { CalendarModule } from 'primeng/calendar';

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
    CalendarModule,
  ],
  templateUrl: './dashboard-items-form.component.html',
  styleUrls: ['./dashboard-items-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardItemsFormComponent implements OnInit {
  @Input() roles: DropdownModel<number>[] = [];
  @Input() users: DropdownModel<number>[] = [];
  sectionDashboard: DropdownModel<number>[] = [];
  formattedStartDate: any;
  formattedEndDate: any;

  @Input() set setDashboardItemsDetails(details: DashboardItem | null) {
    if (details) {
      this.dashboardItem = Object.assign({}, details);
      this.formattedStartDate = formatDate(
        new Date(this.dashboardItem.startDate),
        'dd/MM/yyyy',
        'en'
      );
      this.formattedEndDate = formatDate(
        new Date(this.dashboardItem.endDate),
        'dd/MM/yyyy',
        'en'
      );
    }
  }
  @Output() formSave = new EventEmitter<DashboardItem>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  submitted = false;

  dashboardItem: DashboardItem = {
    dashboardSectionId: 0,
    description: '',
    document: '',
    documentName: '',
    endDate: new Date(),
    linkUrl: '',
    roles: [],
    startDate: new Date(),
    title: '',
    users: [],
  };
  uploaded = false;

  onCancelClick() {
    this.formClose.emit();
  }

  constructor(
    private cd: ChangeDetectorRef,
    private readonly rolesServices: RolesApiService,
    private readonly usersServices: UserApiService,
    private readonly dashboardSectionService: DashboardSectionApiService
  ) {}

  ngOnInit(): void {
    this.dashboardSectionService.loadDropdownList().subscribe(response => {
      this.sectionDashboard = [...response.data];
      this.cd.markForCheck();
    });
    this.rolesServices
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.roles =  [...response.data];
        this.cd.markForCheck();
      });

    this.usersServices
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.users = [...response.data];
        this.cd.markForCheck();
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
          this.dashboardItem.document = parsedBase64 as string;
        }
      };
    }
  }
  onSubmit() {
    this.submitted = true;
    if (this.form.valid && this.dashboardItem.document) {
      if (this.dashboardItem.id === 0) {
        delete this.dashboardItem.id;
      }
      this.formSave.emit(this.dashboardItem);
    }
  }
}
