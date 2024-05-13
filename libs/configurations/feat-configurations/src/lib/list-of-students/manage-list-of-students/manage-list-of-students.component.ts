import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SharedModule } from 'primeng/api';
import {
  AdministrationOfficeApiService,
  ExamAssignmentApiService,
  ExamDateApiService,
  ExamSiteApiService,
} from '@msh/configurations/data-access-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ListOfStudentsFiltersComponent } from '../list-of-students-filters/list-of-students-filters.component';
import { ListOfStudentsGridComponent } from '../list-of-students-grid/list-of-students-grid.component';
import { BehaviorSubject, combineLatest, switchMap } from 'rxjs';
import { ExamAssignment } from '@msh/shared/domain-models';
import { TableLazyLoadEvent } from 'primeng/table';
import { UserProfileApiService } from '@msh/user-section/data-access-user-section';
import { RoleName } from '../../users/user-form/role-list';
import { AuthFacade } from '@msh/auth/data-access-auth';

@UntilDestroy()
@Component({
  selector: 'msh-manage-list-of-students',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ConfirmDialogModule,
    SharedModule,
    ListOfStudentsFiltersComponent,
    ListOfStudentsGridComponent,
  ],
  templateUrl: './manage-list-of-students.component.html',
  styleUrls: ['./manage-list-of-students.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageListOfStudentsComponent implements OnInit {
  private studentsList$$ = new BehaviorSubject<ExamAssignment[]>([]);
  studentsList$ = this.studentsList$$.asObservable();
  examDates: DropdownModel<any>[] = [];
  examSites: DropdownModel<any>[] = [];
  administrationOffices: DropdownModel<any>[] = [];
  totalRecords = 0;
  filters: TableLazyLoadEvent | null = null;
  showSortButton = false;
  highSchoolId = 0;
  administrationOfficeId = 0;
  userRole = '';
  academicYear: any;

  event = {
    first: 0,
    rows: 10000,
    filters: {},
    globalFilter: null,
  };

  constructor(
    private readonly examDateService: ExamDateApiService,
    private readonly examSiteService: ExamSiteApiService,
    private readonly examAssignmentService: ExamAssignmentApiService,
    private readonly administrationOfficeApiService: AdministrationOfficeApiService,
    private readonly userService: UserProfileApiService,
    private authFacade: AuthFacade,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.authFacade.academicYear$
      .pipe(
        switchMap((data: any) => {
          if (!data) {
            try {
              data = JSON.parse(localStorage.getItem('academicYear') as string);
            } catch (err) {
              data = null;
            }
          }
          this.academicYear = { ...data };
          return combineLatest([this.userService.getLoggedInUserData()]);
        })
      )
      .subscribe(([user]) => {
        this.administrationOfficeId = user.data.administrationOfficeId;
        this.userRole = user.data.roleName;
        this.highSchoolId = user.data.highSchoolId;
        this.examSiteData();
      });
  }

  getAdministrationOfficesDropdown() {
    this.administrationOfficeApiService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.administrationOffices = response.data;
        this.cd.detectChanges();
      });
  }

  getExamAssignments($event: any) {
    this.filters = Object.assign({}, $event);
    if(this.filters == null) this.filters = {};
    this.filters.sortOrder = 1;
    this.filters.sortField = 'index';
    this.examAssignmentService
      .getAssignments(this.event, $event.examDateId)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.studentsList$$.next(response.data);
        this.totalRecords = response.total;
        this.showSortButton = true;
      });
  }

  sortExamAssignments($event: any) {
    this.examAssignmentService
      .sortAssignments(this.event, $event.examDateId)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response) {
          this.getExamAssignments($event);
        }
      });
  }

  getExamDateDropdown($event: ExamAssignment) {
    this.examDateService
      .forExamSiteId($event.examSiteId)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examDates = response.data;
      });
  }

  getExamSiteDropdown($event?: ExamAssignment) {
    if (!$event || !$event.administrationOfficeId) {
      this.examSiteService
        .loadDropdownList()
        .pipe(untilDestroyed(this))
        .subscribe(response => {
          this.examSites = response.data;
        });
    } else {
      this.examSiteService
        .forAdministrationOffice($event.administrationOfficeId)
        .pipe(untilDestroyed(this))
        .subscribe(response => {
          this.examSites = response.data;
        });
    }
  }

  getExamSitesForZvap() {
    this.examSiteService
      .forAdministrationOffice(this.administrationOfficeId)
      .pipe(untilDestroyed(this))
      .subscribe(res => (this.examSites = res.data));
  }

  getExamSitesForOverseer() {
    this.examSiteService
      .forHighSchool(this.highSchoolId)
      .pipe(untilDestroyed(this))
      .subscribe(res => (this.examSites = res.data));
  }

  examSiteData() {
    if (this.userRole === RoleName.ZVAP) {
      this.getExamSitesForZvap();
      this.getAdministrationOfficesDropdown();
    } else {
      if (this.userRole === RoleName.MbikqyresFormularesh) {
        this.getExamSitesForOverseer();
      } else {
        this.getAdministrationOfficesDropdown();
        this.getExamSiteDropdown();
      }
    }
  }
}
