import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  AdministrationOfficeApiService,
  CityApiService,
  RegionApiService,
  UserApiService,
} from '@msh/configurations/data-access-configurations';
import { User } from '@msh/configurations/domain-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import {
  GRID_ACTIONS,
  GlobalToastService,
  GridEvent,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { BehaviorSubject } from 'rxjs';
import { UserFormComponent } from '../user-form/user-form.component';
import { UserGridComponent } from '../user-grid/user-grid.component';
@UntilDestroy()
@Component({
  selector: 'msh-manage-users',
  standalone: true,
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    ToolbarModule,
    UserGridComponent,
    UserFormComponent,
  ],
  providers: [ConfirmationService],
})
export class ManageUsersComponent implements OnInit {
  private users$$ = new BehaviorSubject<User[]>([]);
  users$ = this.users$$.asObservable();
  filters: LazyLoadEvent | null = null;
  dummyUsers: User[] = [];

  totalRecords = 0;
  selectedUser: User | null = null;
  selectedUsers: User[] = [];
  cities: DropdownModel<number>[] = [];
  universities: DropdownModel<number>[] = [];
  studyPrograms: DropdownModel<number>[] = [];
  highSchools: DropdownModel<number>[] = [];
  universityDepartments: DropdownModel<number>[] = [];
  administrationOffices: DropdownModel<number>[] = [];
  regions: DropdownModel<number>[] = [];

  userDialog = false;

  constructor(
    private readonly userService: UserApiService,
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly cityApiService: CityApiService,
    private readonly administrationOfficeApiService: AdministrationOfficeApiService,
    private readonly regionApiService: RegionApiService
  ) {}

  ngOnInit(): void {
    this.getAdministrationOfficeDropdown();
    this.getCitiesDropdown();
    this.getRegionDropdown();
    this.getHighSchoolsDropdown();
    this.getUniversityDepartamentDropdown();
    this.getStudyProgramsDropdown();
    this.getUniversitiesDropdown();
    this.getUsers();
  }

  onNewClick() {
    this.userDialog = true;
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete selected entities?',
      accept: () => {
        this.toastService.showWarning('Users deleted!');
      },
    });
  }

  onGridEvent(event: GridEvent<User | User[]>) {
    switch (event.action) {
      case GRID_ACTIONS.SELECT_ROW:
        this.selectedUsers = [...this.selectedUsers, event.data as User];
        break;
      case GRID_ACTIONS.UNSELECT_ROW:
        this.selectedUsers = this.selectedUsers.filter(u => {
          u.id !== (event.data as User).id;
        });
        break;
      case GRID_ACTIONS.SELECT_MANY:
        this.selectedUsers = [...this.selectedUsers, ...(event.data as User[])];
        break;
      case GRID_ACTIONS.UNSELECT_ALL:
        this.selectedUsers = [];
        break;
      case GRID_ACTIONS.EDIT:
        this.selectedUser = Object.assign({}, event.data as User);
        this.userDialog = true;
        break;
      case GRID_ACTIONS.DELETE:
        this.confirmationService.confirm({
          message: 'Are you sure that you want to delete this entity?',
          accept: () => {
            this.deleteUser(event.data as User);
          },
        });
        break;
    }
  }

  onFormClose() {
    this.userDialog = false;
  }

  onFormSave(user: User) {
    if (user.id) {
      this.updateUser(user);
    }
    if (!user.id) {
      this.addUser(user);
    }
  }

  getUsers() {
    this.filters = Object.assign({});

    this.userService
      .loadUsers()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        console.log(response.data);
        this.users$$.next(response.data);
        this.totalRecords = response.data.length;
      });
  }

  addUser(user: User) {
    this.userService
      .save(user)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Perdoruesi u shtua me sukses');
          this.userDialog = false;
          this.getUsers();
        }

        if (response.isBadRequest) {
          this.toastService.showError(
            'Ndodhi nje problem gjate ndryshimit te perdoruesit!'
          );
        }
      });
  }

  updateUser(user: User) {
    this.userService
      .update(user)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Perdoruesi u ndryshua me sukses!');

          this.userDialog = false;
          this.getUsers();
        }

        if (response.isBadRequest) {
          this.toastService.showError(
            'Ndodhi nje problem gjate ndryshimit te perdoruesit!'
          );
        }
      });
  }

  deleteUser(user: User) {
    this.userService
      .delete(user.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Perdoruesi u fshi me sukses!');
          this.getUsers();
        }
        if (response.isBadRequest) {
          this.toastService.showError(
            'Ndonje nje problem gjate fshirjes se perdoruesit!'
          );
        }
      });
  }

  getCitiesDropdown() {
    this.cityApiService.loadDropdownList().subscribe(response => {
      this.cities = response.data;
    });
  }

  getAdministrationOfficeDropdown() {
    this.administrationOfficeApiService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.administrationOffices = response.data;
      });
  }

  getRegionDropdown() {
    this.regionApiService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.regions = response.data;
      });
  }

  //TODO: get data from the relevent api service
  getUniversitiesDropdown() {
    this.universities = [
      {
        key: 1,
        value: 'Polis',
      },
    ];
  }

  getHighSchoolsDropdown() {
    this.highSchools = [
      {
        key: 1,
        value: 'Polis',
      },
    ];
  }

  getStudyProgramsDropdown() {
    this.studyPrograms = [
      {
        key: 1,
        value: 'Polis',
      },
    ];
  }

  getUniversityDepartamentDropdown() {
    this.universityDepartments = [
      {
        key: 1,
        value: 'Polis',
      },
    ];
  }
}
