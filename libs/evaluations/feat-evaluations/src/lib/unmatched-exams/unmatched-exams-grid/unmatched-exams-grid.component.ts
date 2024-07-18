import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ExamScoreApiService } from '@msh/evaluations/data-access-evaluations';
import { TableLazyLoadEvent } from 'primeng/table';

import { AuthFacade } from '@msh/auth/data-access-auth';
import { ExamScore } from '@msh/shared/domain-models';
import { AppBoolPipe } from '@msh/shared/ui-shared';
import { ColumnFilterDirective } from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TableModule } from 'primeng/table';
import { BehaviorSubject, combineLatest, map, skip, tap } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'msh-unmatched-exams-grid',
  standalone: true,
  imports: [CommonModule, TableModule, ColumnFilterDirective, AppBoolPipe],
  templateUrl: './unmatched-exams-grid.component.html',
  styleUrls: ['./unmatched-exams-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnmatchedExamsGridComponent {
  private unmatchedExams$$ = new BehaviorSubject<ExamScore[]>([]);
  unmatchedExams$ = this.unmatchedExams$$.asObservable();
  totalRecords = 0;
  filters: TableLazyLoadEvent | null = null;

  constructor(
    private readonly examScoreApiService: ExamScoreApiService,
    private readonly authFacade: AuthFacade
  ) {}

  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    skip(1),
    map(([_]) => {
      if (this.filters) {
        this.unmatchedExamScore(this.filters as TableLazyLoadEvent);
      }
    }),
    tap()
  );

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
