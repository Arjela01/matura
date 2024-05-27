import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  skip,
  tap,
} from 'rxjs';
import { ExamSecret } from '@msh/shared/domain-models';
import { ExamSecretApiService } from '@msh/evaluations/data-access-evaluations';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ColumnFilterDirective } from '@msh/shared/util-shared';
import { SharedModule } from 'primeng/api';
import { AuthFacade } from '@msh/auth/data-access-auth';

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

  constructor(
    private readonly examSecretService: ExamSecretApiService,
    private readonly authFacade: AuthFacade
  ) {}

  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    skip(1),
    map(([_]) => {
      if (this.filters) {
        this.loadData(this.filters as TableLazyLoadEvent);
      }
    }),
    tap()
  );

  loadData($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.examSecretService
      .loadExamSecretsWithoutExamScoresData($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examSecretWithoutScore$$.next(response.data);
        this.totalRecords = response.total;
      });
  }
}
