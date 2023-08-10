import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamScoreApiService } from '@msh/evaluations/data-access-evaluations';
import { TableLazyLoadEvent } from 'primeng/table';

import { TableModule } from 'primeng/table';
import { BehaviorSubject } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ColumnFilterDirective } from '@msh/shared/util-shared';
import { ExamScore } from '@msh/shared/domain-models';

@UntilDestroy()
@Component({
  selector: 'msh-unmatched-exams-grid',
  standalone: true,
  imports: [CommonModule, TableModule, ColumnFilterDirective],
  templateUrl: './unmatched-exams-grid.component.html',
  styleUrls: ['./unmatched-exams-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnmatchedExamsGridComponent {
  private unmatchedExams$$ = new BehaviorSubject<ExamScore[]>([]);
  unmatchedExams$ = this.unmatchedExams$$.asObservable();
  totalRecords = 0;
  filters: TableLazyLoadEvent | null = null;

  constructor(private readonly examScoreApiService: ExamScoreApiService) {}

  unmatchedExamScore($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.examScoreApiService
      .loadUnmatchedExamScores($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.unmatchedExams$$.next(response.data);
        this.totalRecords = response.total;
      });
  }
}
