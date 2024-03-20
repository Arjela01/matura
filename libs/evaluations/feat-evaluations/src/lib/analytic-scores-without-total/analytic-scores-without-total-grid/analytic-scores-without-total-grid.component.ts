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

@UntilDestroy()
@Component({
  selector: 'msh-total-scores-without-analytic-grid',
  standalone: true,
  imports: [
    CommonModule,
    ColumnFilterDirective,
    SharedModule,
    TableModule,
    TooltipModule,
  ],
  templateUrl: './analytic-scores-without-total-grid.component.html',
  styleUrls: ['./analytic-scores-without-total-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticScoresWithoutTotalGridComponent {
  private analyticScoresWithoutTotalList$$ = new BehaviorSubject<
    AnalyticScoresWithoutTotalModel[]
  >([]);
  analyticScoresWithoutTotalList$ =
    this.analyticScoresWithoutTotalList$$.asObservable();
  totalRecords = 0;
  filters: TableLazyLoadEvent | null = null;

  constructor(
    private readonly analyticScoresWithoutTotalService: AnalyticScoresWithoutTotalService
  ) {}

  getAnalyticScoresWithoutTotalList($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.analyticScoresWithoutTotalService
      .loadData($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.analyticScoresWithoutTotalList$$.next(response.data);
        this.totalRecords = response.total;
      });
  }
}
