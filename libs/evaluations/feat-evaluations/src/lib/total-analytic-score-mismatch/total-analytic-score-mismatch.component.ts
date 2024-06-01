import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TotalAnalyticScoresMismatchModel } from '@msh/shared/domain-models';
import { ExamQuestionScoreTotalsService } from '@msh/evaluations/data-access-evaluations';
import { ColumnFilterDirective } from '@msh/shared/util-shared';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SharedModule } from 'primeng/api';
import { AuthFacade } from '@msh/auth/data-access-auth';
import { combineLatest, map, skip, tap } from 'rxjs';
@UntilDestroy()
@Component({
  selector: 'msh-total-analytic-score-mismatch',
  standalone: true,
  imports: [CommonModule, ColumnFilterDirective, SharedModule, TableModule],
  templateUrl: './total-analytic-score-mismatch.component.html',
  styleUrls: ['./total-analytic-score-mismatch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TotalAnalyticScoreMismatchComponent {
  scores: TotalAnalyticScoresMismatchModel[] = [];
  totalRecords = 0;
  filters: TableLazyLoadEvent | null = null;

  constructor(
    private scoreApiService: ExamQuestionScoreTotalsService,
    private cd: ChangeDetectorRef,
    private readonly authFacade: AuthFacade
  ) {}

  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    skip(1),
    map(([_]) => {
      if (this.filters) {
        this.loadRows(this.filters as TableLazyLoadEvent);
      }
    }),
    tap()
  );

  loadRows($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.scoreApiService
      .getExamScoreExamQuestionTotalMismatches($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.scores = response.data;
        this.totalRecords = response.total;
        this.cd.detectChanges();
      });
  }
}
