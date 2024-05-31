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
import { AuthFacade } from '@msh/auth/data-access-auth';

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
    private readonly analyticScoresWithoutTotalService: AnalyticScoresWithoutTotalService,
    private readonly authFacade: AuthFacade
  ) {}

  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    skip(1),
    map(([_]) => {
      if (this.filters) {
        this.getAnalyticScoresWithoutTotalList(
          this.filters as TableLazyLoadEvent
        );
      }
    }),
    tap()
  );

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
