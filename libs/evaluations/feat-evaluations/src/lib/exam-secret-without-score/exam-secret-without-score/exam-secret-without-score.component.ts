import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { ExamSecret } from '@msh/shared/domain-models';
import { ExamSecretApiService } from '@msh/evaluations/data-access-evaluations';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ColumnFilterDirective } from '@msh/shared/util-shared';
import { SharedModule } from 'primeng/api';

@UntilDestroy()
@Component({
  selector: 'msh-exam-secret-without-score',
  standalone: true,
  imports: [CommonModule, ColumnFilterDirective, SharedModule, TableModule],
  templateUrl: './exam-secret-without-score.component.html',
  styleUrls: ['./exam-secret-without-score.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamSecretWithoutScoreComponent {
  private examSecretWithoutScore$$ = new BehaviorSubject<ExamSecret[]>([]);
  examSecretWithoutScore$ = this.examSecretWithoutScore$$.asObservable();
  totalRecords = 0;
  filters: TableLazyLoadEvent | null = null;

  constructor(private readonly examSecretService: ExamSecretApiService) {}

  loadData($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.examSecretService
      .loadExamSecretWithoutScoreData($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examSecretWithoutScore$$.next(response.data);
        this.totalRecords = response.total;
      });
  }
}
