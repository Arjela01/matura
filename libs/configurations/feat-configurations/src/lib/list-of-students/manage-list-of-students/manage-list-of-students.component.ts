import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SharedModule } from 'primeng/api';
import {
  ExamAssignmentApiService,
  ExamDateApiService,
  ExamSiteApiService,
} from '@msh/configurations/data-access-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ListOfStudentsFiltersComponent } from '../list-of-students-filters/list-of-students-filters.component';
import { ListOfStudentsGridComponent } from '../list-of-students-grid/list-of-students-grid.component';
import { BehaviorSubject } from 'rxjs';
import { ExamAssignment } from '@msh/shared/domain-models';
import { TableLazyLoadEvent } from 'primeng/table';
import { UserProfileApiService } from '@msh/user-section/data-access-user-section';
import { RoleName } from '../../users/user-form/role-list';

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
  totalRecords = 0;
  filters: TableLazyLoadEvent | null = null;
  showSortButton = false;

  event = {
    first: 0,
    rows: 10000,
    filters: {},
    globalFilter: null,
  };

  constructor(
    private readonly examDateService: ExamDateApiService,
    private readonly examSiteService: ExamSiteApiService,
    private readonly examAssignmentService: ExamAssignmentApiService
  ) {}

  ngOnInit() {
    this.getExamSiteDropdown();
  }

  getExamAssignments($event: any) {
    this.filters = Object.assign({}, $event);
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
        this.studentsList$$.next(response.data);
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
  getExamSiteDropdown() {
    this.examSiteService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examSites = response.data;
      });
  }
}
