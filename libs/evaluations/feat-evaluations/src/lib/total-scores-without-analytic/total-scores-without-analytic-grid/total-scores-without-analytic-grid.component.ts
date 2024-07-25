import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  skip,
  tap,
} from 'rxjs';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ExamQuestionScoreTotalsService } from '@msh/evaluations/data-access-evaluations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ColumnFilterDirective } from '@msh/shared/util-shared';
import { SharedModule } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { AuthFacade } from '@msh/auth/data-access-auth';
import { AcademicYear, ExamScores } from '@msh/shared/domain-models';
import { AppBoolPipe, CustomSwitchComponent } from '@msh/shared/ui-shared';

@UntilDestroy()
@Component({
  selector: 'msh-students-average-grade',
  standalone: true,
  imports: [
    CommonModule,
    ColumnFilterDirective,
    SharedModule,
    TableModule,
    TooltipModule,
    AppBoolPipe,
    CustomSwitchComponent,
  ],
  templateUrl: './total-scores-without-analytic-grid.component.html',
  styleUrls: ['./total-scores-without-analytic-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TotalScoresWithoutAnalyticGridComponent {
  private totalScoresWithoutAnalyticList$$ = new BehaviorSubject<ExamScores[]>(
    []
  );
  totalScoresWithoutAnalyticList$ =
    this.totalScoresWithoutAnalyticList$$.asObservable();
  totalRecords = 0;
  filters: TableLazyLoadEvent | null = null;
  isOn = false;
  currentAcademicYear!: Partial<AcademicYear>;

  constructor(
    private readonly examQuestionScoreTotalsService: ExamQuestionScoreTotalsService,
    private readonly authFacade: AuthFacade
  ) {}

  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    distinctUntilChanged(),
    map(([data]) => {
      this.currentAcademicYear = data;
      this.isOn = this.currentAcademicYear?.isFall ?? false;
      if (this.filters) {
        this.getExamScoresWithoutAnalyticScoresList(
          this.filters as TableLazyLoadEvent
        );
      }
    }),
    tap()
  );

  onSwitchChange(event: any) {
    this.isOn = event;
    this.getExamScoresWithoutAnalyticScoresList(
      this.filters as TableLazyLoadEvent
    );
  }

  getExamScoresWithoutAnalyticScoresList($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    if (this.isOn && this.currentAcademicYear?.isFall) {
      this.filters.filters = {
        ...this.filters.filters,
        isFall: {
          value: this.currentAcademicYear.isFall,
          matchMode: 'equals',
        },
      };
    } else {
      this.filters.filters = {};
    }

    this.examQuestionScoreTotalsService
      .getExamScoresWithoutExamQuestionTotals(this.filters)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.totalScoresWithoutAnalyticList$$.next(response.data);
        this.totalRecords = response.total;
      });
  }
}
