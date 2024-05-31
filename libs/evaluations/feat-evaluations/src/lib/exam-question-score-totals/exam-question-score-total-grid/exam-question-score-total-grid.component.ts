import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, combineLatest, map, skip, tap } from 'rxjs';
import { AnalyticScoresWithoutTotalModel } from '@msh/shared/domain-models';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { AnalyticScoresWithoutTotalService } from '@msh/evaluations/data-access-evaluations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ColumnFilterDirective } from '@msh/shared/util-shared';
import { SharedModule } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { Router } from '@angular/router';
import { AuthFacade } from '@msh/auth/data-access-auth';

@UntilDestroy()
@Component({
  selector: 'msh-exam-question-score-total-grid',
  standalone: true,
  imports: [
    CommonModule,
    ColumnFilterDirective,
    SharedModule,
    TableModule,
    TooltipModule,
  ],
  templateUrl: './exam-question-score-total-grid.component.html',
  styleUrls: ['./exam-question-score-total-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamQuestionScoreTotalGridComponent {
  private analyticScoresList$$ = new BehaviorSubject<
    AnalyticScoresWithoutTotalModel[]
  >([]);
  analyticScoresList$ = this.analyticScoresList$$.asObservable();
  totalRecords = 0;
  filters: TableLazyLoadEvent | null = null;

  constructor(
    private readonly analyticScoresWithoutTotalService: AnalyticScoresWithoutTotalService,
    private readonly router: Router,
    private readonly authFacade: AuthFacade
  ) {}

  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    skip(1),
    map(([_]) => {
      if (this.filters) {
        this.getAnalyticScoresList(this.filters as TableLazyLoadEvent);
      }
    }),
    tap()
  );

  getAnalyticScoresList($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.analyticScoresWithoutTotalService
      .loadExamQuestionScoreTotals($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.analyticScoresList$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  onEditClick(analyticScore: AnalyticScoresWithoutTotalModel) {
    this.router.navigate([
      `/evaluations/analytic-score-edit/${analyticScore.examTypeId}/${analyticScore.examSubjectId}/${analyticScore.examVariantId}/${analyticScore.testNumber}/${analyticScore.barcode}`,
    ]);
  }
}
