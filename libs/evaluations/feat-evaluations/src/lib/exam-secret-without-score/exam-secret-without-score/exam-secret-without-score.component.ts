import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthFacade } from '@msh/auth/data-access-auth';
import { ExamSecretApiService } from '@msh/evaluations/data-access-evaluations';
import { ExamSecret } from '@msh/shared/domain-models';
import { AppBoolPipe } from '@msh/shared/ui-shared';
import { ColumnFilterDirective } from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SharedModule } from 'primeng/api';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import {
  BehaviorSubject,
  combineLatest,
  map,
  skip,
  tap,
} from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'msh-exam-secret-without-score',
  standalone: true,
  imports: [CommonModule, ColumnFilterDirective, SharedModule, TableModule, AppBoolPipe],
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
