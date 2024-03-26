import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { TotalScoresWithoutAnalyticModel } from '@msh/shared/domain-models';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TotalScoresWithoutAnalyticService } from '@msh/evaluations/data-access-evaluations';
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
  templateUrl: './total-scores-without-analytic-grid.component.html',
  styleUrls: ['./total-scores-without-analytic-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TotalScoresWithoutAnalyticGridComponent {
  private totalScoresWithoutAnalyticList$$ = new BehaviorSubject<
    TotalScoresWithoutAnalyticModel[]
  >([]);
  totalScoresWithoutAnalyticList$ =
    this.totalScoresWithoutAnalyticList$$.asObservable();
  totalRecords = 0;
  filters: TableLazyLoadEvent | null = null;

  constructor(
    private readonly totalScoresWithoutAnalyticService: TotalScoresWithoutAnalyticService
  ) {}

  getTotalScoresWithoutAnalyticList($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.totalScoresWithoutAnalyticService
      .loadData($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.totalScoresWithoutAnalyticList$$.next(response.data);
        this.totalRecords = response.total;
      });
  }
}
