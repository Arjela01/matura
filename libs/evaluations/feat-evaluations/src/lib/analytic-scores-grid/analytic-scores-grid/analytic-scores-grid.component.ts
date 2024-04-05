import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { AnalyticScoresWithoutTotalModel } from '@msh/shared/domain-models';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { AnalyticScoresWithoutTotalService } from '@msh/evaluations/data-access-evaluations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ColumnFilterDirective } from '@msh/shared/util-shared';
import { SharedModule } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { Router } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'msh-analytic-scores-grid',
  standalone: true,
  imports: [
    CommonModule,
    ColumnFilterDirective,
    SharedModule,
    TableModule,
    TooltipModule,
  ],
  templateUrl: './analytic-scores-grid.component.html',
  styleUrls: ['./analytic-scores-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticScoresGridComponent {
  private analyticScoresList$$ = new BehaviorSubject<
    AnalyticScoresWithoutTotalModel[]
  >([]);
  analyticScoresList$ = this.analyticScoresList$$.asObservable();
  totalRecords = 0;
  filters: TableLazyLoadEvent | null = null;

  constructor(
    private readonly analyticScoresWithoutTotalService: AnalyticScoresWithoutTotalService,
    private readonly router: Router
  ) {}

  getAnalyticScoresList($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.analyticScoresWithoutTotalService
      .loadAnalyticScoresData($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.analyticScoresList$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  onEditClick(analyticScore: AnalyticScoresWithoutTotalModel) {
    this.router.navigate([
      `/evaluations/analytic-score-edit/${analyticScore.examTypeId}/${analyticScore.examSubjectId}/${analyticScore.examVariantId}/${analyticScore.barcode}`,
    ]);
  }
}
