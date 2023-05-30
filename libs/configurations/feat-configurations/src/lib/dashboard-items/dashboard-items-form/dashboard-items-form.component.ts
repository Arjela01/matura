import { CommonModule, formatDate } from '@angular/common';
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
import { FileUploadModule } from 'primeng/fileupload';

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
  Observable,
  combineLatest,
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
})
export class DashboardItemsFormComponent implements OnInit {
  @Input() roles: DropdownModel<number>[] = [];
  @Input() users: DropdownModel<number>[] = [];
  sectionDashboard: BehaviorSubject<DropdownModel<number>[]> =
    new BehaviorSubject<DropdownModel<number>[]>([]);
  formattedStartDate: any;
  formattedEndDate: any;
  rolesArray: any = [];
  usersArray: any = [];

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
    dashboardSectionId: '',
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
          Object.entries(item.roles).forEach(([key, value]) =>
            this.rolesArray.push({ key, value, parentKey: null })
          );
          Object.entries(item.users).forEach(([key, value]) =>
            this.usersArray.push({ key, value, parentKey: null })
          );
          item.users = this.usersArray;
          item.roles = this.rolesArray;
          this.sectionDashboard.next(sections.data);
          this.roles = [...roles.data];
          this.dashboardItem = { ...item };
          this.dashboardItem.dashboardSectionId = item.dashboardSectionId;
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
        }
      };
    }
  }
  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      if (this.dashboardItem.id === 0) {
        delete this.dashboardItem.id;
      }
      this.dashboardItem;
      this.dashboardItem.roles = this.dashboardItem.roles.map(
        (data: any) => data.key
      );
      this.dashboardItem.users = this.dashboardItem.users.map(
        (data: any) => data.key
      );
      this.dashboardItemsApiService
        .save(this.dashboardItem)
        .pipe(untilDestroyed(this))
        .subscribe(response => {
          if (response.isSuccessful) {
            this.toaster.showSuccess(
              'Konfigurimi i dashboard-it u shtua me sukses!'
            );
            this.router.navigate(['configurations/dashboard-items']);
          } else this.toaster.showError(response.errorMessage);

          if (response.isBadRequest)
            this.toaster.showError(
              'Ndodhi një problem gjatë ndryshimit konfigurimit të dashboard-it!'
            );
        });
    }
  }
}
