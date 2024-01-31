import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TabViewModule } from 'primeng/tabview';
import { ManageManualExamGradeComponent } from '../../manual-exam-grade/manage-manual-exam-grade/manage-manual-exam-grade.component';
import { ExamGradeRequestEditComponent } from '../exam-grade-request-edit/exam-grade-request-edit.component';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ExamGradeRequestFormComponent } from '../exam-grade-request-form/exam-grade-request-form.component';
import { GlobalToastService } from '@msh/shared/util-shared';
import { ExamGradeRequestService } from '@msh/applications/data-access-applications';
import {
  AcademicYearApiService,
  HighSchoolApiService,
} from '@msh/configurations/data-access-configurations';
import { DropdownModel } from '@msh/shared/data-access-shared';
import { ExamGradeRequestModel } from '@msh/shared/domain-models';
import { TableLazyLoadEvent } from 'primeng/table';
import { BehaviorSubject } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'msh-manage-grade-request-details',
  standalone: true,
  imports: [
    CommonModule,
    TabViewModule,
    ManageManualExamGradeComponent,
    ExamGradeRequestEditComponent,
    ButtonModule,
    RippleModule,
    RouterLink,
    ExamGradeRequestFormComponent,
  ],
  templateUrl: './manage-grade-request-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageGradeRequestDetailsComponent implements OnInit {
  private examGradeRequest$$ = new BehaviorSubject<ExamGradeRequestModel[]>([]);
  filters: TableLazyLoadEvent | null = null;
  totalRecords = 0;
  academicYears: DropdownModel<number>[] = [];
  examGradeRequestStatus: DropdownModel<string>[] = [];
  highSchools: DropdownModel<number>[] = [];
  examGradeRequest: any;
  id: any;
  constructor(
    private readonly examGradeRequestService: ExamGradeRequestService,
    private readonly academicYearService: AcademicYearApiService,
    private readonly route: ActivatedRoute,
    private readonly toastService: GlobalToastService,
    private readonly highSchoolService: HighSchoolApiService,
    private readonly router: Router
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }
  event = {
    first: 0,
    rows: 10,
    sortOrder: 1,
    filters: {},
    globalFilter: null,
  };

  ngOnInit() {
    this.getAcademicYears();
    this.getExamRequestStatus();
    this.getExamRequestById();
    this.getHighSchools();
  }
  getExamRequestById() {
    this.examGradeRequestService
      .getExamGradeRequestById(this.id)
      .subscribe(res => {
        this.examGradeRequest = {
          ...res.data,
          dateOfBirth: new Date(res.data.dateOfBirth),
        };
      });
  }
  getAcademicYears() {
    this.academicYearService
      .loadDropdownList()
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.academicYears = res.data;
        console.log(123, this.academicYears);
      });
  }

  getExamRequestStatus() {
    this.examGradeRequestService
      .getStatus()
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.examGradeRequestStatus = res.data.map((item: any) => ({
          key: item.id,
          value: item.description,
          label: item.name,
        }));
      });
  }
  updateExamGradeRequest(examGradeRequest: ExamGradeRequestModel) {
    this.examGradeRequestService
      .updateExamGradeRequest(examGradeRequest)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        if (response.isSuccessful) {
          this.toastService.showSuccess(
            'Kërkesa për notat u ndryshua me sukses!'
          );
          this.getExamGradeRequest(this.event);
          this.router.navigate(['applications/exam-grade-request']);
        } else this.toastService.showError(response.errorMessage);
        if (response.isBadRequest)
          this.toastService.showError(
            'Ndodhi një problem gjatë ndryshimit të kërkesës!'
          );
      });
  }
  getExamGradeRequest($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.examGradeRequestService
      .loadExamGradeRequest($event)
      .subscribe(response => {
        this.examGradeRequest$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  getHighSchools() {
    this.highSchoolService
      .loadDropDownList()
      .pipe(untilDestroyed(this))
      .subscribe(res => (this.highSchools = res.data));
  }
}
