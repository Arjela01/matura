import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  A1ApiService,
  A1ZApiService,
} from '@msh/applications/data-access-applications';
import { A1Z } from '@msh/applications/domain-application';
import {
  HighSchoolApiService,
  StudentsApiService,
} from '@msh/configurations/data-access-configurations';
import { ApiResult } from '@msh/shared/data-access-shared';
import {
  HighSchool,
  Student,
  SubjectType,
} from '@msh/shared/domain-models';
import {
  GlobalToastService,
  GRID_ACTIONS,
  GridEvent,
} from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { BehaviorSubject, concatMap, map, Observable, switchMap } from 'rxjs';
import { A1ReportViewComponent } from '../a1-report-view/a1-report-view.component';

@UntilDestroy()
@Component({
  selector: 'msh-manage-a1-report-view',
  standalone: true,
  imports: [CommonModule, A1ReportViewComponent],
  templateUrl: './manage-a1-report-view.component.html',
  styleUrls: ['./manage-a1-report-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ManageA1ReportViewComponent {
  private a1Form$$ = new BehaviorSubject<A1Z>({});
  private studentInfo$$ = new BehaviorSubject<Student | null>(null);
  private carriedSubjects$$ = new BehaviorSubject<any | null>([]);
  private highSchoolInfo$$ = new BehaviorSubject<HighSchool | null>(null);
  a1$ = this.a1Form$$.asObservable();
  studentInfo$ = this.studentInfo$$.asObservable();
  carriedSubjects$ = this.carriedSubjects$$.asObservable();
  highSchoolInfo$ = this.highSchoolInfo$$.asObservable();
  filters: TableLazyLoadEvent | null = null;

  totalRecords = 0;
  selectedAcademicYear: A1Z | null = null;
  selecteda1Form: A1Z[] = [];
  displayModal = false;

  id: string | null = null;
  reportType: string | null = null;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: GlobalToastService,
    private readonly a1apiService: A1ApiService,
    private readonly studentApiService: StudentsApiService,
    private readonly highSchoolApiService: HighSchoolApiService,
    private route: ActivatedRoute,
    private a1zApiService: A1ZApiService
  ) {
    this.id = this.route.snapshot.params['id'];
    this.reportType = this.route.snapshot.params['reportType'];
    this.geta1Form();
  }

  onDeleteSelectedClick() {
    this.confirmationService.confirm({
      message: 'Jeni i sigurt që doni të fshini vitet akademike të zgjedhura?',
      accept: () => {
        this.toastService.showWarning('Vitet akademike të zgjedhura u fshinë!');
      },
    });
  }

  onGridEvent(event: GridEvent<A1Z | A1Z[]>) {
    switch (event.action) {
      case GRID_ACTIONS.EDIT:
        this.selectedAcademicYear = Object.assign({}, event.data as A1Z);
        this.displayModal = true;
        break;
    }
  }

  onModalClose() {
    this.displayModal = false;
  }

  getReportById(): Observable<ApiResult<A1Z>> {
    return this.a1zApiService.getOne(this.id as string).pipe(
      untilDestroyed(this),
      map((element: ApiResult<A1Z>) => {
        const carriedSubjects = [];
        carriedSubjects.push({
          name: element.data.subjectD1Name,
          label: 'D1',
          subjectType: SubjectType.Mandatory,
          score: element.data.scoreD1,
        });
        carriedSubjects.push({
          name: element.data.subjectD2Name,
          label: 'D2',
          subjectType: SubjectType.Mandatory,
          score: element.data.scoreD2,
        });
        carriedSubjects.push({
          name: element.data.subjectD3Name,
          label: 'D3',
          subjectType: SubjectType.Mandatory,
          score: element.data.scoreD3,
        });
        carriedSubjects.push({
          name: element.data.subjectZ1Name,
          label: 'Z1',
          subjectType: SubjectType.Optional,
          score: element.data.scoreZ1,
        });
        carriedSubjects.push({
          name: element.data.subjectZ2Name,
          label: 'Z2',
          subjectType: SubjectType.Optional,
          score: element.data.scoreZ2,
        });

        carriedSubjects.push({
          name: element.data.subjectZ3Name,
          label: 'Z3',
          subjectType: SubjectType.Optional,
          score: element.data.scoreZ3,
        });
        this.carriedSubjects$$.next(
          carriedSubjects.filter(data => data && data.name) as any
        );
        return element;
      })
    );
  }

  geta1Form() {
    this.filters = {
      first: 0,
      rows: 10000000,
      sortOrder: 1,
      filters: {},
      globalFilter: null,
    };
    let highSchoolId = 0;
    this.getReportById()
      .pipe(
        switchMap(response => {
          this.a1Form$$.next(response.data);
          return this.studentApiService.getById(response.data.studentId);
        }),
        concatMap((students: any) => {
          this.studentInfo$$.next(students.data);
          highSchoolId = students.data.highSchoolId;
          return this.highSchoolApiService.loadHighSchools(
            this.filters as LazyLoadEvent
          );
        })
      )

      .subscribe(response => {
        this.highSchoolInfo$$.next(
          response.data.find(el => el.id === highSchoolId) as HighSchool
        );
      });
  }
}
