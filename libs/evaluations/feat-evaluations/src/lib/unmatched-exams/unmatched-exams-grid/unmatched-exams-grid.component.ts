import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnmatchedExamsApiService } from '@msh/evaluations/data-access-evaluations';
import { LazyLoadEvent } from 'primeng/api';
import { ExamScore } from '@msh/evaluations/domain-evaluations';

import { TableModule } from 'primeng/table';
import { BehaviorSubject } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {ColumnFilterDirective} from "@msh/shared/util-shared";

@UntilDestroy()
@Component({
  selector: 'msh-unmatched-exams-grid',
  standalone: true,
  imports: [CommonModule, TableModule  , ColumnFilterDirective],
  templateUrl: './unmatched-exams-grid.component.html',
  styleUrls: ['./unmatched-exams-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnmatchedExamsGridComponent {
  private unmatchedExams$$ = new BehaviorSubject<ExamScore[]>([]);
  unmatchedExams$ = this.unmatchedExams$$.asObservable();
  totalRecords = 0;
  filters: LazyLoadEvent | null = null;

  constructor(
    private readonly unmatchedExamsService: UnmatchedExamsApiService
  ) {}

  unmatchedExamScore($event: LazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.unmatchedExamsService
      .loadUnmatchedExamScores($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.unmatchedExams$$.next(response.data);
        this.totalRecords = response.total;
      });
  }
}
