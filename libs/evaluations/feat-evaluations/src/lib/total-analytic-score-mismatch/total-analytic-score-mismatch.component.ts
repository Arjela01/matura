import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TotalAnalyticScoresMismatchModel } from '@msh/shared/domain-models';
import { AnalyticScoresWithoutTotalService } from '@msh/evaluations/data-access-evaluations';
import { ColumnFilterDirective } from '@msh/shared/util-shared';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SharedModule } from 'primeng/api';
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
  constructor(
    private scoreApiService: AnalyticScoresWithoutTotalService,
    private cd: ChangeDetectorRef
  ) {}
  loadRows($event: TableLazyLoadEvent) {
    this.scoreApiService
      .loadTotalAnalyticMismatchData($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.scores = response.data;
        this.totalRecords = response.total;
        this.cd.detectChanges();
      });
  }
}
