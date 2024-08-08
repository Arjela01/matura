import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
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
import { DropdownModel } from '@msh/shared/data-access-shared';
import { User } from '@msh/shared/domain-models';
import {
  GRID_ACTIONS,
  GlobalToastService,
  GridEvent,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { BehaviorSubject } from 'rxjs';
import { UserFormComponent } from '../user-form/user-form.component';
import { UserGridComponent } from '../user-grid/user-grid.component';
import { UsersPasswordResetViewComponent } from '../users-password-reset-view/users-password-reset-view.component';
import { TableLazyLoadEvent } from 'primeng/table';
import { StudentsGridComponent } from '../../../../../../applications/feat-applications/src/lib/students/students-grid/students-grid.component';
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
    StudentsGridComponent,
  ],
  providers: [ConfirmationService],
})
export class ManageUsersComponent implements OnInit {
  private users$$ = new BehaviorSubject<User[]>([]);
  users$ = this.users$$.asObservable();
  filters: TableLazyLoadEvent | null = null;

  id: string | undefined;
  selectedRecord: any;
  headerText: any;
  displayHistoryForm = false;
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
  displayModal = false;
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
    this.selectedUser = {} as User;
  }

  onGridEvent(event: GridEvent<any | User[]>) {
    switch (event.action) {
      case GRID_ACTIONS.HISTORY:
        this.selectedRecord = Object.assign({}, event.data);
        this.id = event.data.id;
        this.headerText = `Historiku për Përdoruesin {${event.data.id}}`;
        this.displayHistoryForm = true;
        break;
      case GRID_ACTIONS.CUSTOM_ACTION1:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt që doni te gjeneroni nje fjalëkalim të ri?',
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
          message: 'Jeni i sigurt që doni të fshini përdoruesin e zgjedhur?',
          accept: () => {
            this.deleteUser(event.data as User);
          },
        });
        break;
      case GRID_ACTIONS.CUSTOM_ACTION2:
        this.confirmationService.confirm({
          message: 'Jeni i sigurt që doni te ndryshoni statusin e përdoruesit?',
          accept: () => {
            this.changeUserStatus(event.data as User);
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

  getUsers($event: TableLazyLoadEvent): void {
    this.filters = Object.assign({}, $event);

    this.userService
      .loadUsers($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.users$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  changeUserStatus(user: User) {
    this.userService
      .changeUserStatus({
        id: user.id,
        isDisabled: !user.isDisabled,
      })
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            response.data.isDisabled
              ? 'Përdoruesi u çaktivizua me sukses!'
              : 'Përdoruesi u aktivizua me sukses!'
          );
          this.displayModal = false;
          this.getUsers(this.filters as TableLazyLoadEvent);
        }

        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit së statusit!'
          );
      });
  }

  addUser(user: User) {
    this.userService
      .save(user)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess('Përdoruesi u shtua me sukses');
          this.userDialog = false;
          this.getUsers(this.filters as TableLazyLoadEvent);
        }

        if (!response.isSuccessful) {
          this.toastService.showError(
            response.errorMessage !== null
              ? response.errorMessage
              : 'Ndodhi një problem gjatë shtimit te përdoruesit!'
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
          this.toastService.showSuccess('Përdoruesi u ndryshua me sukses!');

          this.userDialog = false;
          this.getUsers(this.filters as TableLazyLoadEvent);
        }
        if (!response.isSuccessful) {
          this.toastService.showError(
            response.errorMessage !== null
              ? response.errorMessage
              : 'Ndodhi një problem gjatë ndryshimit të përdoruesit!'
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
          this.toastService.showSuccess('Fjalëkalimi u ndryshua me sukses!');
          this.userDialog = false;
          this.resetPasswordGenerated = true;
          this.newUserPasswordObj = {
            ...response.data,
          };
          this.cdr.detectChanges();
        }

        if (!response.isSuccessful) {
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të përdoruesit!'
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
          this.getUsers(this.filters as TableLazyLoadEvent);
        }
        if (!response.isSuccessful) {
          this.toastService.showError(
            'Ndodhi një problem gjatë fshirjes së përdoruesit!'
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
