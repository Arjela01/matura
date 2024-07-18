import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthFacade } from '@msh/auth/data-access-auth';
import { ExamScoreApiService } from '@msh/evaluations/data-access-evaluations';
import { ExamScore } from '@msh/shared/domain-models';
import { AppBoolPipe } from '@msh/shared/ui-shared';
import { ColumnFilterDirective } from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as FileSaver from 'file-saver';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { BehaviorSubject, combineLatest, map, skip, tap } from 'rxjs';
@UntilDestroy()
@Component({
  selector: 'msh-exam-score-grid',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule,
    RippleModule,
    ColumnFilterDirective,
    RouterLink,
    AppBoolPipe
],
  templateUrl: './exam-scores-secrets-grid.component.html',
  styleUrls: ['./exam-scores-secrets-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamScoresSecretsGridComponent {
  private examScores$$ = new BehaviorSubject<ExamScore[]>([]);
  examScores$ = this.examScores$$.asObservable();
  filters: TableLazyLoadEvent | null = null;
  totalRecords = 0;
  academicYear$ = combineLatest([this.authFacade.academicYear$]).pipe(
    skip(1),
    map(([_]) => {
      if (this.filters) {
        this.getExamScores(this.filters as TableLazyLoadEvent);
      }
    }),
    tap()
  );
  constructor(
    private readonly examScoreService: ExamScoreApiService,
    private authFacade: AuthFacade
  ) {}

  getExamScores($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    this.examScoreService
      .loadMatchedExamScores($event)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examScores$$.next(response.data);
        this.totalRecords = response.total;
      });
  }

  downloadFile() {
    this.examScoreService
      .exportExamScoreSecret()
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        const blob: any = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        FileSaver.saveAs(
          blob,
          'Piket e provimit pas sekretimit Export[TEMPLATE]'
        );
      });
  }
}
