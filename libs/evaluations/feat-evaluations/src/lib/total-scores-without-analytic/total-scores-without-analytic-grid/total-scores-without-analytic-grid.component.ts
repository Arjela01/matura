import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { combineLatest, distinctUntilChanged, skip, tap } from 'rxjs';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ExamQuestionScoreTotalsService } from '@msh/evaluations/data-access-evaluations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ColumnFilterDirective } from '@msh/shared/util-shared';
import { SharedModule } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { AuthFacade } from '@msh/auth/data-access-auth';
import { ExamScores } from '@msh/shared/domain-models';
import { AppBoolPipe } from '@msh/shared/ui-shared';
import { CustomSwitchComponent } from '@msh/layout/feat-layout';

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
})
export class TotalScoresWithoutAnalyticGridComponent {
  totalScoresWithoutAnalyticList: ExamScores[] = [];
  totalRecords = 0;
  filters: TableLazyLoadEvent | null = null;
  isOn = false;

  constructor(
    private readonly examQuestionScoreTotalsService: ExamQuestionScoreTotalsService,
    private readonly authFacade: AuthFacade,
    private readonly cd: ChangeDetectorRef
  ) {}

  changes$ = combineLatest([
    this.authFacade.academicYear$.pipe(skip(1)),
    this.authFacade.isFall$.pipe(
      tap(isFall => {
        this.isOn = isFall;
      })
    ),
  ])
    .pipe(
      distinctUntilChanged(),
      skip(1),
      untilDestroyed(this),
      tap(() => {
        if (this.filters) {
          this.getExamScoresWithoutAnalyticScoresList(
            this.filters as TableLazyLoadEvent
          );
        }
      })
    )
    .subscribe();

  onSwitchChange(event: any) {
    this.isOn = event;
    this.getExamScoresWithoutAnalyticScoresList(
      this.filters as TableLazyLoadEvent
    );
  }

  getExamScoresWithoutAnalyticScoresList($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    if (this.isOn) {
      this.filters.filters = {
        ...this.filters.filters,
        isFall: {
          value: this.isOn,
          matchMode: 'equals',
        },
      };
    } else {
      const { isFall, ...restFilters } = this.filters.filters || {};
      this.filters.filters = restFilters;
    }

    this.examQuestionScoreTotalsService
      .getExamScoresWithoutExamQuestionTotals(this.filters)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.totalScoresWithoutAnalyticList = response.data;
        this.totalRecords = response.total;
        this.cd.markForCheck();
      });
  }
}
