import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnmatchedExamsApiService } from '@msh/evaluations/data-access-evaluations';
import { LazyLoadEvent } from 'primeng/api';
import { ExamScore } from '@msh/evaluations/domain-evaluations';

import { TableModule } from 'primeng/table';
import { BehaviorSubject } from 'rxjs';
import { untilDestroyed } from '@ngneat/until-destroy';

@Component({
  selector: 'msh-unmatched-exams-grid',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './unmatched-exams-grid.component.html',
  styleUrls: ['./unmatched-exams-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnmatchedExamsGridComponent {
  private unmatchedExams$$ = new BehaviorSubject<ExamScore[]>([]);
  unmatchedExams$ = this.unmatchedExams$$;
  totalRecords = 0;
  filters: LazyLoadEvent | null = null;

  constructor(
    private readonly unmatchedExamsService: UnmatchedExamsApiService
  ) {}

  unmatchedExamScore($event: LazyLoadEvent) {
    // eslint-disable-next-line no-debugger
    debugger;
    this.filters = Object.assign({}, $event);

    this.unmatchedExamsService
      .loadUnmatchedExamScores($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.unmatchedExams$.next(response.data);
        this.totalRecords = response.total;
      });
  }
}
