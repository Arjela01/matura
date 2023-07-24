import { CommonModule, DatePipe, formatDate } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
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
import { FileUpload, FileUploadModule } from 'primeng/fileupload';

import { ActivatedRoute, Router } from '@angular/router';
import {
  DashboardItemsApiService,
  DashboardSectionApiService,
  RolesApiService,
  UserApiService,
} from '@msh/configurations/data-access-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { GlobalToastService } from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  switchMap,
} from 'rxjs';

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
  providers: [DatePipe],
})
export class DashboardItemsFormComponent implements OnInit {
  @Input() roles: DropdownModel<number>[] = [];
  @Input() users: DropdownModel<number>[] = [];
  sectionDashboard: BehaviorSubject<DropdownModel<number>[]> =
    new BehaviorSubject<DropdownModel<number>[]>([]);
  formattedStartDate: any | null = null;
  formattedEndDate: any | null = null;
  rolesArray: any = [];
  usersArray: any = [];
  selectedUsers: string[] = [];
  selectedRoles: string[] = [];
  displayModal = false;
  disabledEndDate: any;

  @ViewChild('uploader', { static: false }) uploader!: FileUpload;

  @Input() set setDashboardItemsDetails(details: DashboardItem | null) {
    if (details) {
      this.dashboardItem = Object.assign({}, details);
    }
    if (details?.endDate) {
      this.dashboardItem.endDate = new Date(details?.endDate);
    }
    if (details?.startDate) {
      this.dashboardItem.startDate = new Date(details?.startDate);
    }
  }

  @Output() formSave = new EventEmitter<DashboardItem>();
  @Output() formClose = new EventEmitter<undefined>();

  @ViewChild('form', { static: true }) form!: NgForm;

  submitted = false;

  dashboardItem: DashboardItem = {
    dashboardSectionId: '',
    description: '',
    document: '',
    documentName: '',
    endDate: null,
    linkUrl: '',
    roles: [],
    startDate: new Date(),
    title: '',
    users: [],
  };
  uploaded = false;

  onCancelClick() {
    this.router.navigate(['configurations/dashboard-items']);
  }

  constructor(
    private cd: ChangeDetectorRef,
    private readonly rolesServices: RolesApiService,
    private readonly usersServices: UserApiService,
    private readonly dashboardSectionService: DashboardSectionApiService,
    private dashboardItemsApiService: DashboardItemsApiService,
    private toaster: GlobalToastService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.dashboardItemsApiService
        .getById(id)
        .pipe(
          switchMap((item: any) => {
            // console.log(this.dashboardItem);
            return combineLatest([
              this.getRoles(),
              this.getDashboardSections(),
              this.getUsers(),
              of(item.data),
            ]);
          })
        )
        .subscribe(([roles, sections, users, item]) => {
          item.roles.forEach((data: any) => {
            this.rolesArray.push({
              key: data.id,
              value: data.name,
              parentKey: null,
            });
            this.selectedRoles.push(data.id);
          });
          item.users.forEach((data: any) => {
            this.usersArray.push({
              key: data.id,
              value: data.name,
              parentKey: null,
            });
            this.selectedUsers.push(data.id);
          });
          this.roles = [...roles.data];
          this.users = [...users.data];
          this.sectionDashboard.next(sections.data);
          this.dashboardItem = { ...item };
          this.dashboardItem.dashboardSectionId = item.dashboardSectionId;
          this.dashboardItem.endDate = item.endDate;
          this.dashboardItem.startDate = item.startDate;
          if (this.dashboardItem.endDate)
            this.formattedEndDate = new Date(this.dashboardItem.endDate);
          this.formattedStartDate = new Date(this.dashboardItem.startDate);
          this.cd.detectChanges();
        });
    } else {
      combineLatest([
        this.getRoles(),
        this.getDashboardSections(),
        this.getUsers(),
      ]).subscribe(([roles, sections, users]) => {
        this.sectionDashboard.next(sections.data);
        this.roles = [...roles.data];
        this.users = [...users.data];
        this.cd.detectChanges();
      });
    }
  }

  getRoles(): Observable<any> {
    return this.rolesServices.loadDropdownList().pipe(untilDestroyed(this));
  }

  getDashboardSections(): Observable<any> {
    return this.dashboardSectionService
      .loadDropdownList()
      .pipe(untilDestroyed(this));
  }

  getUsers(): Observable<any> {
    return this.usersServices.loadDropdownList().pipe(untilDestroyed(this));
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
          this.dashboardItem.documentName = file.name;
          this.cd.detectChanges();
        }
      };
    }
  }

  updateEndDateRange() {
    if (this.formattedStartDate) {
      const startDate = new Date(this.formattedStartDate);
      if (this.formattedEndDate) {
        const endDate = new Date(this.formattedEndDate);
        startDate.setDate(startDate.getDate() + 1);

        this.disabledEndDate = [];
        while (endDate < startDate) {
          this.disabledEndDate.push(new Date(endDate));
          endDate.setDate(endDate.getDate() + 1);
        }
      }
    } else {
      this.disabledEndDate = null;
    }
  }

  onSubmit() {
    if (this.dashboardItem.endDate && this.dashboardItem.startDate) {
      this.dashboardItem.endDate = this.formattedEndDate;
      this.dashboardItem.startDate = this.formattedStartDate;
    }
    const id = this.route.snapshot.params['id'];
    this.submitted = true;
    if (this.form.valid) {
      if (this.dashboardItem.endDate) {
        this.dashboardItem.endDate = formatDate(
          this.dashboardItem.endDate,
          'yyyy-MM-dd',
          'en-US'
        );
      }
      this.dashboardItem.startDate = formatDate(
        this.dashboardItem.startDate,
        'yyyy-MM-dd',
        'en-US'
      );
      if (this.dashboardItem.id === 0) {
        delete this.dashboardItem.id;
      }
      this.dashboardItem.roles = this.selectedRoles.map((data: any) => data);
      this.dashboardItem.users = this.selectedUsers.map((data: any) => data);
      if (id) {
        this.dashboardItemsApiService
          .update(this.dashboardItem)
          .pipe(untilDestroyed(this))
          .subscribe(response => {
            if (response.isSuccessful) {
              this.toaster.showSuccess(
                'Konfigurimi i dashboard-it u ndryshua me sukses!'
              );
              this.router.navigate(['configurations/dashboard-items']);
            } else {
              this.toaster.showError(response.errorMessage);
            }
            if (response.isBadRequest) {
              this.toaster.showError(
                'Ndodhi një problem gjatë konfigurimit të dashboard-it!'
              );
            }
          });
      } else {
        this.dashboardItemsApiService
          .save(this.dashboardItem)
          .pipe(
            switchMap(response => {
              if (response.isSuccessful) {
                this.toaster.showSuccess(
                  'Konfigurimi i dashboard-it u shtua me sukses!'
                );
                this.router.navigate(['configurations/dashboard-items']);
              } else {
                this.toaster.showError(response.errorMessage);
              }
              if (response.isBadRequest) {
                this.toaster.showError(
                  'Ndodhi një problem gjatë ndryshimit konfigurimit të dashboard-it!'
                );
              }
              return of(response);
            })
          )
          .subscribe(error => {
            console.log(error);
          });
      }
    }
  }

  clearFile(): void {
    this.dashboardItem.document = null;
    this.dashboardItem.documentName = '';
    this.uploader.clear();
  }

  downloadDocument() {
    if (!this.dashboardItem.document) alert('Nuk ka dokument të ngarkuar');

    const byteCharacters = atob(this.dashboardItem.document);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const mimeType = 'application/pdf';
    const blob = new Blob([byteArray], { type: mimeType });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = this.dashboardItem.documentName;
    link.click();
  }
}
