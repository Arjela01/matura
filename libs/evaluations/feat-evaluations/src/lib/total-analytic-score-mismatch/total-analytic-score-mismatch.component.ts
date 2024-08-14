import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TotalAnalyticScoresMismatchModel } from '@msh/shared/domain-models';
import { ExamQuestionScoreTotalsService } from '@msh/evaluations/data-access-evaluations';
import { ColumnFilterDirective } from '@msh/shared/util-shared';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SharedModule } from 'primeng/api';
import { AuthFacade } from '@msh/auth/data-access-auth';
import { combineLatest, distinctUntilChanged, skip, tap } from 'rxjs';
import { AppBoolPipe } from '@msh/shared/ui-shared';
import { CustomSwitchComponent } from '@msh/layout/feat-layout';

@UntilDestroy()
@Component({
  selector: 'msh-total-analytic-score-mismatch',
  standalone: true,
  imports: [
    CommonModule,
    ColumnFilterDirective,
    SharedModule,
    TableModule,
    CustomSwitchComponent,
    AppBoolPipe,
  ],
  templateUrl: './total-analytic-score-mismatch.component.html',
  styleUrls: ['./total-analytic-score-mismatch.component.scss'],
})
export class TotalAnalyticScoreMismatchComponent {
  scores: TotalAnalyticScoresMismatchModel[] = [];
  totalRecords = 0;
  filters: TableLazyLoadEvent | null = null;
  isOn = false;

  constructor(
    private scoreApiService: ExamQuestionScoreTotalsService,
    private readonly authFacade: AuthFacade,
    private cd: ChangeDetectorRef
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
          this.loadRows(this.filters as TableLazyLoadEvent);
        }
      })
    )
    .subscribe();

  onSwitchChange(event: any) {
    this.isOn = event;
    this.loadRows(this.filters as TableLazyLoadEvent);
  }

  loadRows($event: TableLazyLoadEvent) {
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

    this.scoreApiService
      .getExamScoreExamQuestionTotalMismatches(this.filters)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.scores = response.data;
        this.totalRecords = response.total;
        this.cd.detectChanges();
      });
  }
}
