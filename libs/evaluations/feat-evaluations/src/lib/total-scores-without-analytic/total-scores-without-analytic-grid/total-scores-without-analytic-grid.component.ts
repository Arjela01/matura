import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, combineLatest, map, skip, tap } from 'rxjs';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ExamQuestionScoreTotalsService } from '@msh/evaluations/data-access-evaluations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ColumnFilterDirective } from '@msh/shared/util-shared';
import { SharedModule } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { AuthFacade } from '@msh/auth/data-access-auth';
import { ExamScores } from '@msh/shared/domain-models';

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

  constructor(
    private readonly examQuestionScoreTotalsService: ExamQuestionScoreTotalsService,
    private readonly authFacade: AuthFacade
  ) {}

  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    skip(1),
    map(([_]) => {
      if (this.filters) {
        this.getExamScoresWithoutAnalyticScoresList(
          this.filters as TableLazyLoadEvent
        );
      }
    }),
    tap()
  );

  getExamScoresWithoutAnalyticScoresList($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.examQuestionScoreTotalsService
      .getExamScoresWithoutExamQuestionTotals($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.totalScoresWithoutAnalyticList$$.next(response.data);
        this.totalRecords = response.total;
      });
  }
}
