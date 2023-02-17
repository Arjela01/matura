import { CommonModule } from '@angular/common';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {
  AdministrationOfficeApiService,
  CityApiService,
  HighSchoolApiService,
  RegionApiService,
  RolesApiService,
  StudyProgramApiService,
  UniversityApiService,
  UniversityDepartmentApiService,
  UserApiService,
} from '@msh/configurations/data-access-configurations';
import { User } from '@msh/shared/domain-models';
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
import { RippleModule } from 'primeng/ripple';
import { UsersPasswordResetViewComponent } from '../users-password-reset-view/users-password-reset-view.component';
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
    RippleModule,
    UsersPasswordResetViewComponent,
  ],
  providers: [ConfirmationService],
})
export class ManageUsersComponent implements OnInit {
  private users$$ = new BehaviorSubject<User[]>([]);
  users$ = this.users$$.asObservable();
  filters: LazyLoadEvent | null = null;

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
  roles: DropdownModel<number>[] = [];

  userDialog = false;
  resetPasswordGenerated = false;
  newUserPasswordObj: any = {};

  constructor(
    private readonly userService: UserApiService,
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly cityApiService: CityApiService,
    private readonly administrationOfficeApiService: AdministrationOfficeApiService,
    private readonly regionApiService: RegionApiService,
    private readonly studyProgramService: StudyProgramApiService,
    private readonly universityService: UniversityApiService,
    private readonly universityDepartmentService: UniversityDepartmentApiService,
    private readonly highSchoolService: HighSchoolApiService,
    private readonly roleService: RolesApiService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getAdministrationOfficeDropdown();
    this.getCitiesDropdown();
    this.getRegionDropdown();
    this.getHighSchoolsDropdown();
    this.getUniversityDepartamentDropdown();
    this.getStudyProgramsDropdown();
    this.getUniversitiesDropdown();
    this.getRolesDropdown();
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
      case GRID_ACTIONS.CUSTOM_ACTION1:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt qe doni te gjeneroni nje password te ri?',
          accept: () => {
            this.passwordGenerate(event.data as User);
          },
        });
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

  getUsers($event: LazyLoadEvent): void {
    this.filters = Object.assign({}, $event);

    this.userService
      .loadUsers($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        console.log(response.data);
        this.users$$.next(response.data);
        this.totalRecords = response.total;
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
          this.getUsers(this.filters as LazyLoadEvent);
        }

        if (!response.isSuccessful) {
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
          this.getUsers(this.filters as LazyLoadEvent);
        }
        if (!response.isSuccessful) {
          this.toastService.showError(
            'Ndodhi nje problem gjate ndryshimit te perdoruesit!'
          );
        }
      });
  }

  passwordGenerate(user: User) {
    this.userService
      .generateNewPass(user.id)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Fjalkalimi u ndryshua me sukses!');
          this.userDialog = false;
          this.resetPasswordGenerated = true;
          this.cdr.detectChanges();
          // this.newUserPasswordObj = {
          //   ...response.data;
          // }
          this.newUserPasswordObj = {
            username: "asdhahsdhasdh",
            password: "asjdjasdasdhhasd"
          }

        }

        if (!response.isSuccessful) {
          //fshije pasi te egzistoje API ok
          this.userDialog = false;
          this.resetPasswordGenerated = true;
          this.cdr.detectChanges();
          this.newUserPasswordObj = {
            username: "asdhahsdhasdh",
            password: "asjdjasdasdhhasd"
          }
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
          this.getUsers(this.filters as LazyLoadEvent);
        }
        if (!response.isSuccessful) {
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

  getUniversitiesDropdown() {
    this.universityService.loadDropdownList().subscribe(response => {
      this.universities = response.data;
    });
  }

  getHighSchoolsDropdown() {
    this.highSchoolService.loadDropDownList().subscribe(response => {
      this.highSchools = response.data;
    });
  }

  getStudyProgramsDropdown() {
    this.studyProgramService.loadDropDownList().subscribe(response => {
      this.studyPrograms = response.data;
    });
  }

  getUniversityDepartamentDropdown() {
    this.universityDepartmentService.loadDropdownList().subscribe(response => {
      this.universityDepartments = response.data;
    });
  }

  getRolesDropdown() {
    this.roleService.loadDropdownList().subscribe(response => {
      this.roles = response.data;
    });
  }
}
