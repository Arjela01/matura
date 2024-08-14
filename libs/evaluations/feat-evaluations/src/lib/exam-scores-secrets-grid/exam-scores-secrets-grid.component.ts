import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthFacade } from '@msh/auth/data-access-auth';
import { ExamScoreApiService } from '@msh/evaluations/data-access-evaluations';
import { AcademicYear, ExamScore } from '@msh/shared/domain-models';
import { AppBoolPipe } from '@msh/shared/ui-shared';
import { ColumnFilterDirective } from '@msh/shared/util-shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { CustomSwitchComponent } from '@msh/layout/feat-layout';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  skip,
  tap,
} from 'rxjs';

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
    AppBoolPipe,
    CustomSwitchComponent,
  ],
  templateUrl: './exam-scores-secrets-grid.component.html',
  styleUrls: ['./exam-scores-secrets-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamScoresSecretsGridComponent {
  private examScores$$ = new BehaviorSubject<ExamScore[]>([]);
  examScores$ = this.examScores$$.asObservable();
  isOn = false;
  currentAcademicYear!: Partial<AcademicYear>;
  filters: TableLazyLoadEvent | null = null;
  totalRecords = 0;
  changes$ = combineLatest([
    this.authFacade.academicYear$.pipe(skip(1)),
    this.authFacade.isFall$.pipe(
      tap(isFall => {
        this.isOn = isFall;
      })
    ),
  ])
    .pipe(
      distinctUntilChanged(),
      skip(1),
      untilDestroyed(this),
      tap(() => {
        if (this.filters) {
          this.getExamScores(this.filters as TableLazyLoadEvent);
        }
      })
    )
    .subscribe();
  constructor(
    private readonly examScoreService: ExamScoreApiService,
    private authFacade: AuthFacade
  ) {}

  onSwitchChange(event: any) {
    this.isOn = event;
    this.getExamScores(this.filters as TableLazyLoadEvent);
  }

  getExamScores($event: TableLazyLoadEvent) {
    this.filters = Object.assign({}, $event);

    if (this.isOn) {
      this.filters.filters = {
        ...this.filters.filters,
        isFall: {
          value: this.isOn,
          matchMode: 'equals',
        },
      };
    } else {
      const { isFall, ...restFilters } = this.filters.filters || {};
      this.filters.filters = restFilters;
    }

    this.examScoreService
      .loadMatchedExamScores(this.filters)
      .pipe(untilDestroyed(this))
      .subscribe(response => {
        this.examScores$$.next(response.data);
        this.totalRecords = response.total;
      });
  }
}
