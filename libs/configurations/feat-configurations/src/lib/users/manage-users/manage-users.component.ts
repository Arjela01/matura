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
    this.dummyUsers = userdata;
    // this.userStore.loadusers();
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

  getUsers($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.userService
      .loadUsers($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
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
          this.getUsers(this.filters as LazyLoadEvent);
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
          this.getUsers(this.filters as LazyLoadEvent);
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

export const userdata = [
  {
    id: 1,
    displayName: 'Hamel',
    fileName: 'Testing',
    administrationOffice:
      'morbi non quam nec dui luctus rutrum nulla tellus in',
    universityDepartment:
      'lorem quisque ut erat curabitur gravida nisi at nibh in hac habitasse platea dictumst aliquam augue quam',
    highSchool:
      'lacus purus aliquet at feugiat non pretium quis lectus suspendisse potenti in eleifend quam',
    lastName: 'sapien non mi integer ac neque duis bibendum morbi non',
    lastPasswordChange:
      'justo in blandit ultrices enim lorem ipsum dolor sit amet consectetuer adipiscing elit proin',
    name: 'ut ultrices vel augue vestibulum ante ipsum primis in faucibus orci',
    overseerCode:
      'lorem id ligula suspendisse ornare consequat lectus in est risus auctor sed tristique',
    studentId:
      'nascetur ridiculus mus etiam vel augue vestibulum rutrum rutrum neque aenean auctor gravida',
    studyProgramId: 12,
    universityId: 56,
  },
  {
    id: 2,
    displayName: 'Bill',
    fileName: 'Testing',
    administrationOffice:
      'quis odio consequat varius integer ac leo pellentesque ultrices mattis odio donec vitae nisi nam',
    universityDepartment:
      'nulla suspendisse potenti cras in purus eu magna vulputate luctus cum sociis natoque penatibus et magnis dis parturient montes',
    highSchool:
      'habitasse platea dictumst aliquam augue quam sollicitudin vitae consectetuer eget rutrum',
    lastName:
      'aliquet pulvinar sed nisl nunc rhoncus dui vel sem sed sagittis nam congue risus',
    lastPasswordChange:
      'sed justo pellentesque viverra pede ac diam cras pellentesque volutpat dui maecenas tristique est et tempus semper',
    name: 'cursus id turpis integer aliquet massa id lobortis convallis tortor risus',
    overseerCode:
      'at velit vivamus vel nulla eget eros elementum pellentesque quisque porta',
    studentId:
      'vel enim sit amet nunc viverra dapibus nulla suscipit ligula in lacus curabitur at',
    studyProgramId: 20,
    universityId: 2,
  },
  {
    id: 3,
    displayName: 'Forbes',
    fileName: 'Testing',
    administrationOffice:
      'feugiat non pretium quis lectus suspendisse potenti in eleifend quam a odio',
    universityDepartment:
      'enim lorem ipsum dolor sit amet consectetuer adipiscing elit proin',
    highSchool:
      'faucibus orci luctus et ultrices posuere cubilia curae duis faucibus accumsan odio curabitur convallis duis consequat dui nec nisi volutpat',
    lastName:
      'amet justo morbi ut odio cras mi pede malesuada in imperdiet et commodo vulputate justo in blandit ultrices enim',
    lastPasswordChange:
      'nulla suspendisse potenti cras in purus eu magna vulputate luctus cum sociis natoque penatibus et magnis dis parturient montes',
    name: 'nisl aenean lectus pellentesque eget nunc donec quis orci eget orci vehicula condimentum curabitur in libero',
    overseerCode:
      'nibh in lectus pellentesque at nulla suspendisse potenti cras in purus eu magna vulputate luctus cum sociis natoque penatibus',
    studentId:
      'posuere cubilia curae nulla dapibus dolor vel est donec odio justo sollicitudin ut',
    studyProgramId: 94,
    universityId: 50,
  },
  {
    id: 4,
    displayName: 'Mitzi',
    fileName: 'Testing',
    administrationOffice:
      'diam cras pellentesque volutpat dui maecenas tristique est et tempus semper est quam pharetra magna ac',
    universityDepartment:
      'sit amet cursus id turpis integer aliquet massa id lobortis convallis tortor risus dapibus augue vel',
    highSchool:
      'at lorem integer tincidunt ante vel ipsum praesent blandit lacinia erat vestibulum sed magna at',
    lastName:
      'at velit eu est congue elementum in hac habitasse platea dictumst morbi vestibulum velit id pretium iaculis diam',
    lastPasswordChange:
      'etiam faucibus cursus urna ut tellus nulla ut erat id mauris vulputate elementum nullam varius',
    name: 'dictumst aliquam augue quam sollicitudin vitae consectetuer eget rutrum at lorem integer tincidunt ante vel ipsum praesent blandit',
    overseerCode:
      'ultrices erat tortor sollicitudin mi sit amet lobortis sapien sapien non',
    studentId:
      'et ultrices posuere cubilia curae donec pharetra magna vestibulum aliquet ultrices erat tortor sollicitudin mi sit amet lobortis sapien sapien',
    studyProgramId: 37,
    universityId: 83,
  },
  {
    id: 5,
    displayName: 'Nester',
    fileName: 'Testing',
    administrationOffice:
      'cursus urna ut tellus nulla ut erat id mauris vulputate',
    universityDepartment:
      'faucibus orci luctus et ultrices posuere cubilia curae mauris viverra diam vitae quam suspendisse',
    highSchool:
      'curae donec pharetra magna vestibulum aliquet ultrices erat tortor sollicitudin mi sit',
    lastName:
      'est risus auctor sed tristique in tempus sit amet sem fusce consequat nulla nisl nunc nisl duis bibendum felis',
    lastPasswordChange:
      'ut dolor morbi vel lectus in quam fringilla rhoncus mauris enim leo rhoncus sed vestibulum sit amet cursus id',
    name: 'dis parturient montes nascetur ridiculus mus etiam vel augue vestibulum rutrum rutrum neque aenean',
    overseerCode:
      'phasellus in felis donec semper sapien a libero nam dui proin leo odio porttitor id consequat in',
    studentId:
      'tempus vel pede morbi porttitor lorem id ligula suspendisse ornare consequat lectus in',
    studyProgramId: 65,
    universityId: 97,
  },
  {
    id: 6,
    displayName: 'Mimi',
    fileName: 'Testing',
    administrationOffice:
      'libero nullam sit amet turpis elementum ligula vehicula consequat morbi a ipsum integer a nibh in quis justo maecenas rhoncus',
    universityDepartment:
      'consectetuer eget rutrum at lorem integer tincidunt ante vel ipsum praesent blandit lacinia erat vestibulum sed magna at',
    highSchool:
      'rhoncus aliquet pulvinar sed nisl nunc rhoncus dui vel sem sed sagittis nam congue risus',
    lastName:
      'pellentesque ultrices phasellus id sapien in sapien iaculis congue vivamus metus arcu adipiscing',
    lastPasswordChange:
      'adipiscing lorem vitae mattis nibh ligula nec sem duis aliquam convallis nunc proin',
    name: 'justo lacinia eget tincidunt eget tempus vel pede morbi porttitor lorem id ligula suspendisse',
    overseerCode:
      'massa donec dapibus duis at velit eu est congue elementum in',
    studentId:
      'a odio in hac habitasse platea dictumst maecenas ut massa quis augue luctus tincidunt nulla',
    studyProgramId: 81,
    universityId: 32,
  },
  {
    id: 7,
    displayName: 'Curcio',
    fileName: 'Testing',
    administrationOffice:
      'eget tincidunt eget tempus vel pede morbi porttitor lorem id ligula suspendisse ornare consequat lectus in est risus auctor sed',
    universityDepartment:
      'ligula suspendisse ornare consequat lectus in est risus auctor sed',
    highSchool:
      'mauris eget massa tempor convallis nulla neque libero convallis eget eleifend luctus ultricies eu',
    lastName:
      'luctus rutrum nulla tellus in sagittis dui vel nisl duis ac nibh fusce lacus purus aliquet at feugiat non',
    lastPasswordChange:
      'vestibulum vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia',
    name: 'amet lobortis sapien sapien non mi integer ac neque duis bibendum morbi',
    overseerCode:
      'tempus vel pede morbi porttitor lorem id ligula suspendisse ornare consequat lectus in est risus auctor',
    studentId:
      'dui maecenas tristique est et tempus semper est quam pharetra magna ac consequat metus sapien ut',
    studyProgramId: 91,
    universityId: 74,
  },
  {
    id: 8,
    displayName: 'Violetta',
    fileName: 'Testing',
    administrationOffice:
      'erat vestibulum sed magna at nunc commodo placerat praesent blandit',
    universityDepartment:
      'arcu adipiscing molestie hendrerit at vulputate vitae nisl aenean lectus pellentesque eget nunc donec quis orci eget',
    highSchool:
      'duis bibendum morbi non quam nec dui luctus rutrum nulla tellus in sagittis dui vel',
    lastName:
      'libero nam dui proin leo odio porttitor id consequat in consequat ut nulla sed accumsan felis ut at dolor quis',
    lastPasswordChange:
      'nec condimentum neque sapien placerat ante nulla justo aliquam quis',
    name: 'proin at turpis a pede posuere nonummy integer non velit',
    overseerCode:
      'ut volutpat sapien arcu sed augue aliquam erat volutpat in congue etiam',
    studentId:
      'orci nullam molestie nibh in lectus pellentesque at nulla suspendisse potenti cras in purus eu magna vulputate',
    studyProgramId: 48,
    universityId: 22,
  },
  {
    id: 9,
    displayName: 'Sumner',
    fileName: 'Testing',
    administrationOffice:
      'erat id mauris vulputate elementum nullam varius nulla facilisi cras',
    universityDepartment:
      'quis turpis eget elit sodales scelerisque mauris sit amet eros suspendisse accumsan tortor quis turpis',
    highSchool:
      'velit vivamus vel nulla eget eros elementum pellentesque quisque porta volutpat erat quisque',
    lastName:
      'elementum ligula vehicula consequat morbi a ipsum integer a nibh in quis justo',
    lastPasswordChange:
      'ut volutpat sapien arcu sed augue aliquam erat volutpat in congue etiam justo etiam pretium iaculis justo in',
    name: 'in sagittis dui vel nisl duis ac nibh fusce lacus purus aliquet at feugiat non pretium',
    overseerCode:
      'morbi sem mauris laoreet ut rhoncus aliquet pulvinar sed nisl nunc rhoncus dui',
    studentId:
      'dui vel nisl duis ac nibh fusce lacus purus aliquet at feugiat non pretium quis lectus suspendisse potenti',
    studyProgramId: 43,
    universityId: 81,
  },
  {
    id: 10,
    displayName: 'Lotti',
    fileName: 'Testing',
    administrationOffice:
      'justo lacinia eget tincidunt eget tempus vel pede morbi porttitor lorem id ligula suspendisse ornare consequat lectus in est',
    universityDepartment:
      'enim blandit mi in porttitor pede justo eu massa donec dapibus duis at velit eu est congue',
    highSchool:
      'sollicitudin mi sit amet lobortis sapien sapien non mi integer ac',
    lastName:
      'ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae mauris viverra diam vitae quam',
    lastPasswordChange:
      'est quam pharetra magna ac consequat metus sapien ut nunc vestibulum ante ipsum primis',
    name: 'congue diam id ornare imperdiet sapien urna pretium nisl ut',
    overseerCode:
      'ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae donec pharetra magna vestibulum aliquet ultrices erat tortor sollicitudin',
    studentId:
      'turpis integer aliquet massa id lobortis convallis tortor risus dapibus augue vel',
    studyProgramId: 40,
    universityId: 84,
  },
];
